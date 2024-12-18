import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import Constants from "expo-constants";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import SplashScreen from "./screens/home/SplashScreen";
import MainNavigation from "./navigation/MainNavigation";
import AuthNavigation from "./navigation/AuthNavigation";
import ContextProviders from "./contexts/ContextProvider";
import { initializeAuthState } from "./redux/features/auth/AuthSlice";
import {
  cleanupConnections,
  initializeConnections,
} from "./services/MQTTClient";
import { useRegisterNotificationTokenMutation } from "./services/NotificationsApi";

import {
  useFonts as useInterFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import {
  useFonts as useRobotoFonts,
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
  Roboto_100Thin_Italic,
  Roboto_300Light_Italic,
  Roboto_400Regular_Italic,
  Roboto_500Medium_Italic,
  Roboto_700Bold_Italic,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Extract timestamp from notification data or use the current time if not provided
    const timestamp =
      notification.request.content.data?.timestamp ||
      new Date().toLocaleString();
    const body = notification.request.content.body || "No message";

    // Append the timestamp to the notification body
    const updatedBody = `${body}\n\nReceived at: ${timestamp}`;

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      // Modify the notification body to include the timestamp
      // This will display the updated body in the push notification banner
      title: "notification.request.content.title",
      body: updatedBody,
      data: notification.request.content.data,
    };
  },
});

function handleRegistrationError(errorType, errorMessage) {
  Alert.alert(errorType, errorMessage, [{ text: "OK" }]);
}

async function registerForPushNotificationsAsync(t) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    handleRegistrationError(
      t("permission_error_title"),
      t("push_notification_permission_denied_message")
    );
    return;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    handleRegistrationError(t("error"), t("project_id_not_found_message"));
    return;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log(pushTokenString);

    return pushTokenString;
  } catch (e) {
    handleRegistrationError(t("error"), `${e}`);
  }
}

const AppContent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [appIsReady, setAppIsReady] = useState(false);
  const [permissionsAsked, setPermissionsAsked] = useState(false);
  const [registerToken] = useRegisterNotificationTokenMutation();
  const isLoggedIn = useSelector((state) => state.Auth.isLoggedIn);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      androidClientId: Constants.expoConfig.extra.googleOAuthAndroidClientId,
      iosClientId: Constants.expoConfig.extra.googleOAuthIosClientId,
      webClientId: Constants.expoConfig.extra.googleOAuthWebClientId,
    });
  };

  const requestPermissions = async () => {
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== "granted") {
      Alert.alert(
        t("location_permission_denied_title"),
        t("location_permission_denied_message"),
        [{ text: t("ok") }]
      );
    }
    setPermissionsAsked(true);
  };

  const [interFontsLoaded] = useInterFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [robotoFontsLoaded] = useRobotoFonts({
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
    Roboto_100Thin_Italic,
    Roboto_300Light_Italic,
    Roboto_400Regular_Italic,
    Roboto_500Medium_Italic,
    Roboto_700Bold_Italic,
    Roboto_900Black_Italic,
  });

  useEffect(() => {
    async function prepare() {
      try {
        dispatch(initializeAuthState());
        configureGoogleSignIn();
        await requestPermissions();
      } catch (e) {
        console.warn("Error loading fonts", e);
      }
    }

    prepare();
    return () => {
      cleanupConnections();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      initializeConnections();
      registerForPushNotificationsAsync(t)
        .then(async (token) => {
          if (token) {
            try {
              await registerToken({ token: token });
              try {
                await AsyncStorage.setItem("pushToken", JSON.stringify(token));
              } catch (error) {
                console.error("Error saving to storage", error);
              }
            } catch (error) {
              console.error("Error registering token", error);
            }
          }
        })
        .catch((error) => console.error("Error getting push token", error));
    }

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (interFontsLoaded && robotoFontsLoaded && permissionsAsked) {
      setAppIsReady(true);
    }
  }, [interFontsLoaded, robotoFontsLoaded, permissionsAsked]);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  return isLoggedIn ? <MainNavigation /> : <AuthNavigation />;
};

export default function App() {
  const { dark } = useTheme();
  return (
    <ContextProviders>
      <StatusBar style={dark ? "dark" : "light"} />
      <AppContent />
    </ContextProviders>
  );
}
