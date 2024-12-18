import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import TripsNavigation from "./TripsNavigation";
import CarIcon from "../components/icons/CarIcon";
import MainScreen from "../screens/home/MainScreen";
import BellIcon from "../components/icons/BellIcon";
import { customInterpolator } from "../utils/helper";
import VehiclesNavigation from "./VehiclesNavigation";
import SettingsNavigation from "./SettingsNavigation";
import BackArrow from "../components/icons/BackArrow";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import FuelLevelScreen from "../screens/home/FuelLevelScreen";
import CarSearchIcon from "../components/icons/CarSearchIcon";
import { createStackNavigator } from "@react-navigation/stack";
import StreetViewScreen from "../screens/home/StreetViewScreen";
import SpeedLevelScreen from "../screens/home/SpeedLevelScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomAppBar from "../components/navigation/CustomAppBar";
import CustomDrawer from "../components/navigation/CustomDrawer";
import GPSStrengthScreen from "../screens/home/GPSStrengthScreen";
import TamperAlertScreen from "../screens/home/TamperAlertScreen";
import BatteryModeScreen from "../screens/home/BatteryModeScreen";
import BatteryLevelScreen from "../screens/home/BatteryLevelScreen";
import HamburgerMenuIcon from "../components/icons/HamburgerMenuIcon";
import DeviceDetailsScreen from "../screens/home/DeviceDetailsScreen";
import VehicleStatusScreen from "../screens/home/VehicleStatusScreen";
import IgnitionStatusScreen from "../screens/home/IgnitionStatusScreen";
import BatteryVoltageScreen from "../screens/home/BatteryVoltageScreen";
import DrivingStatisticsScreen from "../screens/settings/DrivingStatisticsScreen";
import UserNotificationsScreen from "../screens/notifications/UserNotificationsScreen";
import VehicleNotificationsScreen from "../screens/notifications/VehicleNotificationsScreen";
import BatteryChargingStatusScreen from "../screens/home/BatteryChargingStatusScreen";
import DiagnosticErrorCodeScreen from "../screens/alarms/DiagnosticErrorCodeScreen";
import PrivacyPolicyScreen from "../screens/settings/PrivacyPolicyScreen";
import LicenseAgreement from "../screens/settings/LicenseAggrement";
import VinNumberScreen from "../screens/settings/VinNumberScreen";
import ContactUsScreen from "../screens/settings/ContactUsScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStackNavigation = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const headerTintColor = dark ? "#FFFFFF" : "#353535";
  const backArrowFill = dark ? "#9D9DAD" : "#7C7C91";

  const rightIconsMainScreen = [
    {
      component: CarSearchIcon,
      action: () => {
        navigation.navigate("VehiclesNavigation", {
          params: {
            initialLoad: false,
          },
        });
      },
    },
  ];

  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
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
          paddingRight: 5,
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
        name="MainScreen"
        component={MainScreen}
        options={{
          header: (props) => (
            <CustomAppBar
              {...props}
              navigation={props.navigation}
              title="GPS360x"
              leftIcon={{ component: HamburgerMenuIcon }}
              onLeftPress={() => props.navigation.openDrawer()}
              rightIcons={rightIconsMainScreen}
            />
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="StreetViewScreen"
        component={StreetViewScreen}
        options={{ title: t("view_360") }}
      />
      <Stack.Screen
        name="UserNotificationsScreen"
        component={UserNotificationsScreen}
        options={{ title: t("notifications") }}
      />
      <Stack.Screen
        name="VehicleNotificationsScreen"
        component={VehicleNotificationsScreen}
        options={{ title: t("notifications") }}
      />
      <Stack.Screen
        name="FuelLevelScreen"
        component={FuelLevelScreen}
        options={{
          title: t("fuel_level"),
        }}
      />
      <Stack.Screen
        name="GPSStrengthScreen"
        component={GPSStrengthScreen}
        options={{ title: t("connection_details") }}
      />
      <Stack.Screen
        name="BatteryLevelScreen"
        component={BatteryLevelScreen}
        options={{ title: t("battery_level") }}
      />
      <Stack.Screen
        name="BatteryModeScreen"
        component={BatteryModeScreen}
        options={{ title: t("battery_mode") }}
      />
      <Stack.Screen
        name="SpeedLevelScreen"
        component={SpeedLevelScreen}
        options={{
          title: t("speed_alert"),
        }}
      />
      <Stack.Screen
        name="IgnitionStatusScreen"
        component={IgnitionStatusScreen}
        options={{ title: t("ignition_status") }}
      />
      <Stack.Screen
        name="BatteryChargingStatusScreen"
        component={BatteryChargingStatusScreen}
        options={{ title: t("power_status") }}
      />
      <Stack.Screen
        name="DeviceDetailsScreen"
        component={DeviceDetailsScreen}
        options={{ title: t("device_details") }}
      />
      <Stack.Screen
        name="VehicleStatusScreen"
        component={VehicleStatusScreen}
        options={{ title: t("vehicle_details") }}
      />
      <Stack.Screen
        name="BatteryVoltageScreen"
        component={BatteryVoltageScreen}
        options={{
          title: t("battery_voltage"),
        }}
      />
      <Stack.Screen
        name="TamperAlertScreen"
        component={TamperAlertScreen}
        options={{
          title: t("tamper_alert"),
        }}
      />
      <Stack.Screen
        name="DiagnosticErrorCodeScreen"
        component={DiagnosticErrorCodeScreen}
        options={{
          title: t("diagnostic_error_code"),
        }}
      />
      <Stack.Screen
        name="SettingsNavigation"
        component={SettingsNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VehiclesNavigation"
        component={VehiclesNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DrivingStatisticsScreen"
        component={DrivingStatisticsScreen}
        options={() => ({
          title: t("driving_statistics"),
        })}
      />

      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={() => ({
          title: t("privacy_policy_of_gps360x"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 15,
            textAlign: "center",
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="UserLicenseAggrementScreen"
        component={LicenseAgreement}
        options={() => ({
          title: t("gps360x_end_user_license_agreement_(eula)"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 15,
            textAlign: "center",
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="VinNumberScreen"
        component={VinNumberScreen}
        options={() => ({
          title: t("understanding_how_your_vin_is_utilized"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 15,
            textAlign: "center",
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={() => ({
          title: t("contact_us"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 15,
            textAlign: "center",
            fontWeight: "bold",
          },
        })}
      />
    </Stack.Navigator>
  );
};

const MainNavigation = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const rightIconsMainStackScreen = [
    {
      component: CarIcon,
      action: () => {
        navigation.navigate("VehiclesNavigation", {
          screen: "VehiclesListScreen",
        });
      },
    },
    {
      component: BellIcon,
      action: () => {
        navigation.navigate("UserNotificationsScreen");
      },
    },
  ];

  return (
    <Drawer.Navigator
      initialRouteName="MainStackNavigation"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={(props) => {
        const currentRoute = props.navigation
          .getState()
          .routes.find((r) => r.name === "MainStackNavigation");

        // Check if nested state exists
        const nestedState = currentRoute?.state;
        const isMainScreenActive = nestedState
          ? nestedState.routes[nestedState.index]?.name === "MainScreen"
          : true; // Assume MainScreen is active if no state

        return {
          drawerStyle: {
            width: "100%",
            backgroundColor: colors.background2,
          },
          headerShown: !isMainScreenActive, // Hide header if MainScreen is active
          header: (props) => (
            <CustomAppBar
              {...props}
              navigation={props.navigation}
              title="GPS360x"
              leftIcon={{ component: HamburgerMenuIcon }}
              onLeftPress={() => props.navigation.openDrawer()}
              rightIcons={rightIconsMainStackScreen}
            />
          ),
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "700",
            lineHeight: 29,
          },
          headerTitleAlign: "left",
          headerBackTitleVisible: false,
        };
      }}
    >
      <Drawer.Screen
        name="MainStackNavigation"
        component={MainStackNavigation}
      />
      <Drawer.Screen
        name="TripsNavigationScreen"
        component={TripsNavigation}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigation;
