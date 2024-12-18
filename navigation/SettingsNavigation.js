import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { createStackNavigator } from "@react-navigation/stack";

import { customInterpolator } from "../utils/helper";
import BackArrow from "../components/icons/BackArrow";
import GeofenceScreen from "../screens/alarms/GeofenceScreen";
import HardBrakingScreen from "../screens/alarms/HardBrakingScreen";
import GeofenceListScreen from "../screens/alarms/GeofenceListScreen";
import HarshBrakingScreen from "../screens/alarms/HarshBrakingScreen";
import UnitSettingsScreen from "../screens/settings/UnitSettingsScreen";
import UserSettingsScreen from "../screens/settings/UserSettingsScreen";
import VehicleSettingsScreen from "../screens/settings/VehicleSettingsScreen";
import RapidAccelerationScreen from "../screens/alarms/RapidAccelerationScreen";
import VibrationDetectionScreen from "../screens/alarms/VibrationDetectionScreen";
import AppearanceSettingsScreen from "../screens/settings/AppearanceSettingsScreen";
import NotificationSettingsScreen from "../screens/settings/NotificationSettingsScreen";
import AggressiveSteeringScreen from "../screens/alarms/AggressiveSteeringScreen";

const Stack = createStackNavigator();

const SettingsNavigation = ({ }) => {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const headerTintColor = dark ? "#FFFFFF" : "#353535";
  const backArrowFill = dark ? "#9D9DAD" : "#7C7C91";

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerBackgroundContainerStyle: {
          backgroundColor: colors.background2,
        },
        headerTintColor: headerTintColor,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "700",
          lineHeight: 29,
        },
        headerTitleAlign: "left",
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 15,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BackArrow fill={backArrowFill} width={7} height={14} />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          paddingRight: 15,
        },
        cardStyleInterpolator: customInterpolator,
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <LinearGradient
              colors={["#6FF2FA", "#ED408D"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                position: "absolute",
                width: "95%",
                bottom: 0,
                height: 1,
                left: "2.5%",
              }}
            />
          </View>
        ),
      })}
    >
      <Stack.Screen
        name="UserSettingsScreen"
        component={UserSettingsScreen}
        options={() => ({
          title: t("edit_profile"),
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="UnitSettingsScreen"
        component={UnitSettingsScreen}
        options={() => ({
          title: t("unit"),
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="AppearanceSettingsScreen"
        component={AppearanceSettingsScreen}
        options={() => ({
          title: t("appearance_title"),
          headerShadowVisible: false,
        })}
      />

      <Stack.Screen
        name="NotificationSettingsScreen"
        component={NotificationSettingsScreen}
        options={{
          headerShadowVisible: false,
          title: t("notification_settings_title"),
        }}
      />
      <Stack.Screen
        name="VehicleSettingsScreen"
        component={VehicleSettingsScreen}
        options={{
          headerShadowVisible: false,
          title: t("vehicle_settings_title"),
        }}
      />
      <Stack.Screen
        name="GeofenceListScreen"
        component={GeofenceListScreen}
        options={{ headerShadowVisible: false, title: t("geofences") }}
      />
      <Stack.Screen
        name="GeofenceScreen"
        component={GeofenceScreen}
        options={{ headerShadowVisible: false, title: t("geofence") }}
      />
      <Stack.Screen
        name="RapidAccelerationScreen"
        component={RapidAccelerationScreen}
        options={{ headerShadowVisible: false, title: t("rapid_acceleration") }}
      />
      <Stack.Screen
        name="HardBrakingScreen"
        component={HardBrakingScreen}
        options={{ headerShadowVisible: false, title: t("hard_brake") }}
      />
      <Stack.Screen
        name="HarshBrakingScreen"
        component={HarshBrakingScreen}
        options={{ headerShadowVisible: false, title: t("harsh_brake") }}
      />
      <Stack.Screen
        name="AggressiveSteeringScreen"
        component={AggressiveSteeringScreen}
        options={{
          headerShadowVisible: false,
          title: t("aggressive_steering"),
        }}
      />
      <Stack.Screen
        name="VibrationDetectionScreen"
        component={VibrationDetectionScreen}
        options={{
          headerShadowVisible: false,
          title: t("vibration_detection"),
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigation;
