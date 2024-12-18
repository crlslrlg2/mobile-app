import "dotenv/config";

export default {
  expo: {
    name: "GPS360x",
    slug: "gps360x",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#E0E0E0",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.safelinktheft.gps360x",
      supportsTablet: true,
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [process.env.GOOGLE_MAPS_CFBundleURLSchemes],
          },
        ],
        UIBackgroundModes: ["location", "fetch", "remote-notification"],
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0B0B3D",
      },
      package: "com.safelinktheft.gps360x",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      ["@react-native-google-signin/google-signin"],
      [
        "react-native-fbsdk-next",
        {
          appID: `${process.env.FACEBOOK_APP_ID}`,
          clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
          displayName: "GPS360x",
          scheme: `fb${process.env.FACEBOOK_APP_ID}`,
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos for personalization purposes",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow GPS36x to access your camera",
          microphonePermission: "Allow GPS360x to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-font"
      ]
    ],
    extra: {
      eas: {
        projectId: "f7034cc5-a1f6-41e7-9f28-bcff5e37380e",
      },
      baseUrl: process.env.BASE_URL,
      flespiToken: process.env.FLESPI_TOKEN,
      googleMapsWebApiKey: process.env.GOOGLE_MAPS_WEB_API_KEY,
      googleMapsAndroidApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
      googleMapsIosApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
      googleOAuthIosClientId: process.env.GOOGLE_OAUTH_IOS_CLIENT_ID,
      googleOAuthWebClientId: process.env.GOOGLE_OAUTH_WEB_CLIENT_ID,
      googleOAuthAndroidClientId: process.env.GOOGLE_OAUTH_ANDROID_CLIENT_ID,
      googleReverseGeocodingApiKey:
        process.env.GOOGLE_MAPS_REVERSE_GEOCODING_API_KEY,
    },
    owner: "safelinktheft",
  },
};
