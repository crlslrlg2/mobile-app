import { useCallback } from "react";
import { MapMarker } from "react-native-maps";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const useAnimatedRegion = (location = {}, interval = 500) => {
  const latitude = useSharedValue(location.latitude);
  const longitude = useSharedValue(location.longitude);
  const latitudeDelta = useSharedValue(location.latitudeDelta);
  const longitudeDelta = useSharedValue(location.longitudeDelta);
  const rotation = useSharedValue(location.rotation);

  const animatedProps = useAnimatedProps(() => ({
    coordinate: {
      latitude: latitude.value ?? 0,
      longitude: longitude.value ?? 0,
      latitudeDelta: latitudeDelta.value ?? 0,
      longitudeDelta: longitudeDelta.value ?? 0,
    },
    rotation: rotation.value ?? 0,
  }));

  const animate = useCallback(
    (options) => {
      const { duration = interval, easing = Easing.bezier(0.42, 0, 0.58, 1) } =
        options;

      const animateValue = (value, toValue) => {
        if (toValue === undefined || toValue === null) {
          return;
        }

        value.value = withTiming(toValue, {
          duration,
          easing,
        });
      };

      animateValue(latitude, options.latitude);
      animateValue(longitude, options.longitude);
      animateValue(latitudeDelta, options.latitudeDelta);
      animateValue(longitudeDelta, options.longitudeDelta);
      animateValue(rotation, options.rotation);
    },
    [latitude, longitude, latitudeDelta, longitudeDelta, rotation, interval]
  );

  return {
    props: animatedProps,
    rotation,
    animate,
  };
};

export const AnimatedMarker = Animated.createAnimatedComponent(MapMarker);
