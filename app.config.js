export default {
  expo: {
    name: "SocialMedia",
    slug: "SocialMedia",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.julienlebrun.socialmedia",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      entitlements: {
        "aps-environment": "development",
      },
    },
    android: {
      package: "com.socialmedia.app",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
      output: "server",
      bundler: "metro",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "http://localhost:8081",
        },
      ],
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff",
        },
      ],
    ],
    extra: {
      router: {
        origin: "http://localhost:8081",
      },
      eas: {
        projectId: "43e08ecd-ba64-4053-bf07-d0d466c0ba92",
      },
    },
  },
};
