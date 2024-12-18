import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BackArrow from "../components/icons/BackArrow";
import { createStackNavigator } from "@react-navigation/stack";
import { BottomNavigation, Text, useTheme } from "react-native-paper";
import TripEventsScreen from "../screens/trip/TripEventsScreen";
import CustomAppBar from "../components/navigation/CustomAppBar";
import TripDetailScreen from "../screens/trip/TripDetailScreen";
import TripPlayBackScreen from "../screens/trip/TripPlayBackScreen";
import TripTimelineScreen from "../screens/trip/TripTimelineScreen";
import RecentActivityScreen from "../screens/home/RecentActivityScreen";
import TripStatisticsScreen from "../screens/trip/TripStatisticsScreen";
import { customInterpolator } from "../utils/helper";
import { TouchableOpacity, View } from "react-native";
import DetailsIcon from "../components/icons/DetailsIcon";
import StatsIcon from "../components/icons/StatsIcon";
import EventIcon from "../components/icons/EventIcon";
import PlaybackIcon from "../components/icons/PlaybackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import DoubleBackArrow from "../components/icons/DoubleBackArrow";

// Import your SVG icons
// import DetailIcon from "../components/icons/DetailIcon";
// import StatisticsIcon from "../components/icons/StatisticsIcon";
// import EventsIcon from "../components/icons/EventsIcon";
// import PlaybackIcon from "../components/icons/PlaybackIcon";

const Stack = createStackNavigator();

const TripDetailTabNavigator = (props) => {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("Detail");
  const { colors, dark } = useTheme();
  const { t } = useTranslation();

  const solidIconColor = dark ? "#66688E" : "#9D9DAD";
  const activeColor = "#298689";

  const routes = [
    {
      key: "tripDetail",
      title: t("tripDetail"),
      focusedIcon: DetailsIcon,
      unfocusedIcon: () => <DetailsIcon solidColor={solidIconColor} />,
    },
    {
      key: "tripStatistics",
      title: t("statistics"),
      focusedIcon: StatsIcon,
      unfocusedIcon: () => <StatsIcon solidColor={solidIconColor} />,
    },
    {
      key: "tripEvents",
      title: t("events"),
      focusedIcon: EventIcon,
      unfocusedIcon: () => <EventIcon solidColor={solidIconColor} />,
    },
    {
      key: "tripPlayback",
      title: t("playback"),
      focusedIcon: PlaybackIcon,
      unfocusedIcon: () => <PlaybackIcon solidColor={solidIconColor} />,
    },
  ];

  useEffect(() => {
    setTitle(routes[index].title);
  }, [index]);

  const renderScene = BottomNavigation.SceneMap({
    tripDetail: () => <TripDetailScreen {...props} />,
    tripStatistics: () => <TripStatisticsScreen {...props} />,
    tripEvents: () => <TripEventsScreen {...props} />,
    tripPlayback: () => <TripPlayBackScreen {...props} />,
  });

  return (
    <>
      <CustomAppBar
        title={routes[index].title}
        leftIcon={{ component: () => <BackArrow fill={solidIconColor} /> }}
        onLeftPress={() => props.navigation.goBack()}
        navigation={props.navigation}
      />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        // labeled={false}
        inactiveColor={solidIconColor}
        activeColor={activeColor}
        renderIcon={({ route, focused }) => {
          const IconComponent = route.focusedIcon;
          return (
            <View style={{ flexDirection: "row" }}>
              <View>
                <IconComponent focused={focused} />
              </View>
              {route !== routes[routes.length - 1] && (
                <LinearGradient
                  colors={["#70F2FA", "#EE418D"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    height: 50,
                    width: 0.5,
                    position: "absolute",
                    bottom: -25,
                    right: -35,
                    zIndex: 1,
                  }}
                />
              )}
            </View>
          );
        }}
        sceneAnimationEnabled={true}
        sceneAnimationType="opacity"
        barStyle={{
          backgroundColor: colors.background,
          position: "absolute",
          bottom: 0,
          elevation: 10,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: "hidden",
        }}
        activeIndicatorStyle={{
          backgroundColor: "transparent",
        }}
        getLabelText={({ route }) => route.title}
      />
    </>
  );
};

const TripsNavigation = () => {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();

  const headerTintColor = dark ? "#FFFFFF" : "#353535";
  const backArrowFill = dark ? "#9D9DAD" : "#7C7C91";

  return (
    <Stack.Navigator
      initialRouteName="RecentActivityScreen"
      screenOptions={({ navigation, route }) => ({
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
        headerStyle: {
          backgroundColor: dark ? "#171B4D" : "#FFFFFF",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.13,
          shadowRadius: 12,
          elevation: 5,
        },
        headerLeft: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* First Back Arrow for navigating back */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 20,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BackArrow fill={backArrowFill} width={11} height={20} />
            </TouchableOpacity>
            {route.name === "TripTimelineScreen" && (
              <TouchableOpacity
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "RecentActivityScreen" }],
                  });
                  navigation.navigate("MainScreen");
                }}
                style={{
                  width: 20,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DoubleBackArrow fill={backArrowFill} width={16} height={20} />
              </TouchableOpacity>
            )}
          </View>
        ),

        cardStyleInterpolator: customInterpolator,
      })}
    >
      <Stack.Screen
        name="RecentActivityScreen"
        component={RecentActivityScreen}
        options={{ title: t("recentActivity") }}
      />
      <Stack.Screen
        name="TripTimelineScreen"
        component={TripTimelineScreen}
        options={{ title: t("tripTimeline") }}
      />
      <Stack.Screen
        name="TripDetailScreen"
        component={TripDetailTabNavigator}
        options={{ title: t("tripDetails"), headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default TripsNavigation;
