import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { customInterpolator } from "../utils/helper";
import { LinearGradient } from "expo-linear-gradient";
import BackArrow from "../components/icons/BackArrow";
import AddVehicleNavigator from "./AddVehicleNavigator";
import { IconButton, useTheme } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import VehiclesListScreen from "../screens/vehicles/VehiclesListScreen";
import VehicleSettingsScreen from "../screens/settings/VehicleSettingsScreen";
import {
  resetSteps,
  resetVehicle,
} from "../redux/features/vehicle/AddVehicleSlice";

const Stack = createStackNavigator();

const VehiclesNavigation = () => {
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const headerTintColor = dark ? "#FFFFFF" : "#353535";
  const backArrowFill = dark ? "#9D9DAD" : "#7C7C91";

  return (
    <Stack.Navigator
      initialRouteName="VehiclesListScreen"
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
        name="VehiclesListScreen"
        component={VehiclesListScreen}
        options={({ navigation }) => ({
          title: t("vehicles"),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                dispatch(resetVehicle());
                dispatch(resetSteps());
                navigation.navigate("AddVehicleScreen");
              }}
              style={{ borderRadius: 15 }}
            >
              <LinearGradient
                colors={["#239498", "#3DCBCF"]}
                style={{ borderRadius: 15, width: 30, height: 30 }}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <IconButton
                  icon="plus"
                  size={15}
                  iconColor="#F5F5F5"
                  style={{ margin: 0 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddVehicleScreen"
        options={{ title: t("addVehicle") }}
        component={AddVehicleNavigator}
      />
      <Stack.Screen
        name="EditVehicleScreen"
        options={{ title: t("editVehicle") }}
        component={VehicleSettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default VehiclesNavigation;
