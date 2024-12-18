import React, { useRef, useEffect, useState, createContext } from "react";
import { AppState } from "react-native";

import { useDispatch, useSelector } from "react-redux";

import { AuthApi } from "../services/AuthApi";
import { RootApi } from "../services/RootApi";
import { UserApi } from "../services/UserApi";
import { TripsApi } from "../services/TripsApi";
import { VehiclesApi } from "../services/VehiclesApi";
import { NotificationsApi } from "../services/NotificationsApi";
import { resetTripsSlice } from "../redux/features/trips/TripsSlice";
import { resetVehiclesSlice } from "../redux/features/vehicles/VehiclesSlice";
import { resetAddVehicleSlice } from "../redux/features/vehicle/AddVehicleSlice";
import { resetNotificationsSlice } from "../redux/features/notifications/NotificationsSlice";

const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [isForeground, setIsForeground] = useState(true);
  const [skipAppStateCheck, setSkipAppStateCheck] = useState(false);

  const isLoggedIn = useSelector((state) => state.Auth.isLoggedIn);

  const handleAppStateChange = (nextAppState) => {
    if (skipAppStateCheck) {
      return;
    }

    if (
      (appState.current === "inactive" || appState.current === "background") &&
      nextAppState === "active" &&
      isLoggedIn
    ) {
      // Reset API state
      dispatch(AuthApi.util.resetApiState());
      dispatch(RootApi.util.resetApiState());
      dispatch(TripsApi.util.resetApiState());
      dispatch(VehiclesApi.util.resetApiState());
      dispatch(NotificationsApi.util.resetApiState());

      // Invalidate API tags
      dispatch(UserApi.util.invalidateTags(["User"]));
      dispatch(TripsApi.util.invalidateTags(["Trips"]));
      dispatch(NotificationsApi.util.invalidateTags(["Notifications"]));
      dispatch(
        VehiclesApi.util.invalidateTags([
          "Vehicle",
          "Geofence",
          "VehicleStatistics",
          "Calculator",
        ])
      );

      // Reset Redux slices
      dispatch(resetTripsSlice());
      dispatch(resetVehiclesSlice());
      dispatch(resetAddVehicleSlice());
      dispatch(resetNotificationsSlice());
    }

    appState.current = nextAppState; // Update current state
    setIsForeground(nextAppState === "active");
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => subscription.remove();
  }, [handleAppStateChange]);

  return (
    <AppStateContext.Provider
      value={{
        isForeground,
        skipAppStateCheck,
        setSkipAppStateCheck,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };
