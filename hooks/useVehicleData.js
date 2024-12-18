import { useState, useEffect, useRef } from "react";
import {
  fetchAddress,
  calculateGpsStrength,
  calculateTimeDifference,
  unixToReadableTime,
} from "../utils/helper";
import { useDispatch } from "react-redux";

import {
  telemetrySelectors,
  refactoredTelemetrySelectors,
} from "../constants/constants";
import { useGetSingleVehicleQuery } from "../services/VehiclesApi";
import { updateVehicleTelemetry } from "../redux/features/vehicles/VehiclesSlice";
import {
  publishTelemetry,
  subscribeToMQTTTopic,
  unsubscribeFromMQTTTopic,
} from "../services/MQTTClient";

const useVehicleData = (vehicle, telemetry, t, isSelected = false) => {
  const dispatch = useDispatch();
  // Initialize vehicleData with telemetry values if available
  const [vehicleData, setVehicleData] = useState({
    address: "",
    lastCheck: telemetry?.["position.change.timestamp"]?.value
      ? unixToReadableTime(telemetry?.["position.change.timestamp"]?.value)
      : "",
    fuelLevel: telemetry?.["can.fuel.level"]?.value || "",
    gpsStrength: telemetry ? calculateGpsStrength(telemetry, t) : "",
    batteryLevel: telemetry?.["battery.level"]?.value || "",
    vehicleStatus: telemetry?.["device_status"]?.value
      ? t(telemetry["device_status"].value.toLowerCase())
      : t("stopped"),
    ignitionStatus:
      telemetry?.["engine.ignition.status"]?.value === true
        ? t("on")
        : t("off"),
    lastPositionChange: telemetry?.Trip?.value?.end
      ? calculateTimeDifference(telemetry.Trip.value.end)?.readable
      : "",
    batteryChargingStatus:
      telemetry?.["battery.charging.status"]?.value === true
        ? t("on")
        : telemetry?.["battery.charging.status"]?.value === false
        ? t("off")
        : "",
    vehicleImage: vehicle?.vehicleImage,
    statusMessage: "", // Status message for "Refreshing location..." or "Waiting for update"
  });

  const intervalRef = useRef();
  const addressCache = useRef({});
  const [errorAddress, setErrorAddress] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [copyLocationButtonClicked, setCopyLocationButtonClicked] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Track MQTT subscription status
  // Persistent references for initial time and previous position
  const initialTimeRef = useRef(null);
  const previousLatitudeRef = useRef(telemetry?.position?.value?.latitude);
  const previousLongitudeRef = useRef(telemetry?.position?.value?.longitude);

  const {
    data,
    refetch,
    isFetching: getSingleVehicleLoading,
    isSuccess,
  } = useGetSingleVehicleQuery({
    telemetrySelectors: telemetrySelectors,
    deviceId: vehicle.id,
  });

  const mqttTopic = `flespi/state/gw/devices/${vehicle.deviceId}/telemetry/${refactoredTelemetrySelectors}`;

  // Effect for handling loading state, data dispatch, and MQTT subscriptions
  useEffect(() => {
    if (getSingleVehicleLoading) {
      if (isSelected && isSubscribed) {
        unsubscribeFromMQTTTopic(mqttTopic);
        setIsSubscribed(false);
      }
      setVehicleData((prevData) => ({
        ...prevData,
        ignitionStatus: t("updating"),
        batteryChargingStatus: t("updating"),
        batteryLevel: t("updating"),
        gpsStrength: t("updating"),
        vehicleStatus: t("updating"),
      }));
    } else if (data && isSuccess) {
      dispatch(
        updateVehicleTelemetry({
          id: vehicle.deviceId,
          telemetry: data.data[0]?.telemetry,
        })
      );
    }

    // Subscribe if selected and trip is active and is not subscribed
    if (isSelected && telemetry?.Trip?.value?.is_trip_active && !isSubscribed) {
      const timeout = setTimeout(() => {
        subscribeToMQTTTopic(mqttTopic);
        setIsSubscribed(true);
      }, 2000);

      //   // Clean up on unmount or dependency change
      return () => {
        clearTimeout(timeout);
      };
    }

    // Ensure unsubscribe if no active conditions
    return () => {
      if (isSubscribed) {
        unsubscribeFromMQTTTopic(mqttTopic);
        setIsSubscribed(false);
      }
    };
  }, [
    t,
    data,
    dispatch,
    isSuccess,
    isSelected,
    isSubscribed,
    vehicle.deviceId,
    getSingleVehicleLoading,
    telemetry?.Trip?.value?.is_trip_active,
  ]);

  // Effect for immediate refetch and interval setup
  useEffect(() => {
    if (isSelected) {
      refetch(); // Immediate refetch if selected
    }

    // if trip is active or isSeletecd, call for api to refresh state every 20 seconds(MQTT SUBSCRIBED), else if trip is active and not selected call after every 10 seconds (Without MQTT Movement)
    if (telemetry?.Trip?.value?.is_trip_active) {
      let apiInterval;

      apiInterval = setInterval(() => refetch(), isSelected ? 20000 : 10000);

      // Cleanup interval on unmount or dependency change
      return () => clearInterval(apiInterval);
    }
  }, [telemetry?.Trip?.value?.is_trip_active, refetch, isSelected]);

  // Effect for handling data freshness and displaying status messages
  useEffect(() => {
    if (
      !telemetry?.position?.value?.latitude ||
      !telemetry?.position?.value?.longitude ||
      !telemetry?.Trip?.value?.is_trip_active ||
      !isSelected
    ) {
      // If no position data or vehicle is not selected or not trip mode, return early
      return;
    }

    // Set initialTime only once
    if (initialTimeRef.current === null) {
      initialTimeRef.current = Math.floor(Date.now() / 1000);
    }

    const { latitude, longitude } = telemetry?.position?.value;

    if (
      latitude !== previousLatitudeRef.current ||
      longitude !== previousLongitudeRef.current
    ) {
      // Position has changed, update status message
      setVehicleData((prevData) => ({
        ...prevData,
        statusMessage: t("updated_a_few_seconds_ago"),
      }));

      // Update previous latitude and longitude to new values
      previousLatitudeRef.current = latitude;
      previousLongitudeRef.current = longitude;

      // Reset initialTime to the current time after a new position change
      initialTimeRef.current = Math.floor(Date.now() / 1000);
    } // If position hasn't changed, set a timeout-based freshness check
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const delay = currentTime - initialTimeRef.current;

      // Update status message based on the delay
      setVehicleData((prevData) => ({
        ...prevData,
        statusMessage:
          delay <= 5
            ? t("updated_a_few_seconds_ago")
            : delay <= 15
            ? t("refreshing_location")
            : t("waiting_for_update"),
      }));

      // Stop interval if delay has exceeded 15 seconds
      if (delay > 15) {
        clearInterval(interval);
      }
    }, 5000); // Check every 5 seconds

    // Cleanup interval on dependency change
    return () => clearInterval(interval);
  }, [telemetry?.position, isSelected, t]);

  // Existing interval to update last position change every 60 seconds
  useEffect(() => {
    const getLastPositionChange = () => {
      const timestamp = telemetry?.Trip?.value?.end;

      if (timestamp) {
        const result = calculateTimeDifference(timestamp);
        if (result && result.readable) {
          return result.readable;
        }
      }
      return "";
    };

    // publish stop for devices other than VL502 if not in active trip
    const shouldPublishStopped =
      !telemetry?.Trip?.value?.is_trip_active &&
      telemetry?.[`device_status`]?.value !== "Stopped" &&
      vehicle.deviceTypeId !== 2255;

    if (shouldPublishStopped) {
      setVehicleData((prevState) => ({
        ...prevState,
        vehicleStatus: t("stopped"),
      }));
      publishTelemetry({ device_status: "Stopped" }, vehicle.deviceId);
    }

    intervalRef.current = setInterval(() => {
      setVehicleData((prevData) => ({
        ...prevData,
        lastPositionChange: getLastPositionChange(),
      }));
    }, 60000); // 60 seconds interval

    return () => clearInterval(intervalRef.current);
  }, [telemetry?.Trip?.value?.end, telemetry?.Trip?.value?.is_trip_active]);

  // Set initial vehicle data based on telemetry
  useEffect(() => {
    const positionTimestamp = telemetry?.Trip?.value?.end;
    const lastCheckTimestamp =
      telemetry?.["position"]?.value?.["change.timestamp"] ||
      telemetry?.["position.change.timestamp"]?.value;

    const lastCheck = lastCheckTimestamp
      ? unixToReadableTime(lastCheckTimestamp)
      : "";

    const lastPositionChange = positionTimestamp
      ? calculateTimeDifference(positionTimestamp)?.readable
      : "";

    setVehicleData((prevData) => ({
      ...prevData,
      fuelLevel: telemetry?.["can.fuel.level"]?.value || "",
      batteryLevel: telemetry?.["battery.level"]?.value || "",
      ignitionStatus:
        telemetry?.["engine.ignition.status"]?.value === true
          ? t("on")
          : t("off"),
      gpsStrength: telemetry && calculateGpsStrength(telemetry, t),
      vehicleStatus:
        t(telemetry?.[`device_status`]?.value?.toLowerCase()) || t("stopped"),
      lastPositionChange: lastPositionChange,
      lastCheck: lastCheck,
      batteryChargingStatus:
        telemetry?.["battery.charging.status"]?.value === true
          ? t("on")
          : telemetry?.["battery.charging.status"]?.value === false
          ? t("off")
          : "",
    }));

    if (
      telemetry?.position?.value?.latitude &&
      telemetry?.position?.value?.longitude &&
      (!telemetry?.Trip?.value?.is_trip_active || copyLocationButtonClicked)
    ) {
      fetchAddress(
        telemetry.position.value.latitude,
        telemetry.position.value.longitude,
        addressCache,
        setLoadingAddress,
        setErrorAddress,
        (address) => {
          setVehicleData((prevData) => ({ ...prevData, address }));
        }
      );
    }
  }, [vehicle, telemetry, t, copyLocationButtonClicked]);

  return {
    vehicleData,
    loadingAddress,
    errorAddress,
    copyLocationButtonClicked,
    setCopyLocationButtonClicked,
    getSingleVehicleLoading,
  };
};

export default useVehicleData;
