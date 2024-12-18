import { useEffect, useState, useRef } from "react";
import { fetchAddress } from "../utils/helper"; // Adjust the import path as necessary

const useFetchAddresses = (points) => {
  const addressCache = useRef({});
  const [startAddress, setStartAddress] = useState(
    points[0].osm || ""
  );
  const [endAddress, setEndAddress] = useState(
    points[points.length - 1].osm || ""
  );
  const [loadingStartAddress, setLoadingStartAddress] = useState(false);
  const [loadingEndAddress, setLoadingEndAddress] = useState(false);
  const [errorStartAddress, setErrorStartAddress] = useState(false);
  const [errorEndAddress, setErrorEndAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (trip) {
        const startCoordinate = points[0];
        const endCoordinate =
          points[points.length - 1];

        if (!startAddress) {
          setLoadingStartAddress(true);
          try {
            await fetchAddress(
              startCoordinate.latitude,
              startCoordinate.longitude,
              addressCache,
              setLoadingStartAddress,
              setErrorStartAddress,
              setStartAddress
            );
          } catch (error) {
            setErrorStartAddress(true);
          } finally {
            setLoadingStartAddress(false);
          }
        }

        if (!endAddress) {
          setLoadingEndAddress(true);
          try {
            await fetchAddress(
              endCoordinate.latitude,
              endCoordinate.longitude,
              addressCache,
              setLoadingEndAddress,
              setErrorEndAddress,
              setEndAddress
            );
          } catch (error) {
            setErrorEndAddress(true);
          } finally {
            setLoadingEndAddress(false);
          }
        }
      }
    };

    fetchAddresses();
  }, [trip]);

  return {
    startAddress,
    endAddress,
    loadingStartAddress,
    loadingEndAddress,
    errorStartAddress,
    errorEndAddress,
  };
};

export default useFetchAddresses;
