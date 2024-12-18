import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import VehicleVINScreen from "../screens/vehicles/VehicleVINScreen";
import VehicleDetailsScreen from "../screens/vehicles/VehicleDetailsScreen";
import VehicleSpecificationScreen from "../screens/vehicles/VehicleSpecificationScreen";
import VehicleDeviceDetailsScreen from "../screens/vehicles/VehicleDeviceDetailsScreen";

const Stack = createStackNavigator();

const AddVehicleNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
        animationEnabled: false,
      })}
    >
      <Stack.Screen
        name="VehicleVINScreen"
        component={VehicleVINScreen}
        options={{ title: t("vehicleVIN") }}
      />
      <Stack.Screen
        name="VehicleSpecificationScreen"
        component={VehicleSpecificationScreen}
        options={{ title: t("vehicleSpecification") }}
      />
      <Stack.Screen
        name="VehicleDetailsScreen"
        component={VehicleDetailsScreen}
        options={{ title: t("vehicleDetails") }}
      />
      <Stack.Screen
        name="VehicleDeviceDetailsScreen"
        component={VehicleDeviceDetailsScreen}
        options={{ title: t("vehicleDeviceDetails") }}
      />
    </Stack.Navigator>
  );
};

export default AddVehicleNavigator;
