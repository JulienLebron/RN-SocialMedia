import { createContext, PropsWithChildren, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationsContextType = {};
const NotificationsContext = createContext<NotificationsContextType>({});

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [permissions, setPermissions] =
    useState<Notifications.PermissionStatus | null>(null);
  const [pushToken, setPushToken] = useState<string>();

  useEffect(() => {
    ensurePermissions();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setPushToken);
  }, [permissions]);

  const ensurePermissions = async () => {
    // on Android, we first have to create a channel then ask for permissions
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        enableVibrate: true,
        showBadge: true,
      });
    }

    const existingPermissions = await Notifications.getPermissionsAsync();
    if (existingPermissions.status === "granted") {
      // user already gave permissions
      setPermissions(existingPermissions.status);
      return;
    }

    if (!existingPermissions.canAskAgain) {
      console.log("no permission, but we cannot request again.");
      Alert.alert(
        "Enable permission",
        "Please go to settings and enable push notification permission"
      );
    }

    const newPermission = await Notifications.requestPermissionsAsync();
    setPermissions(newPermission.status);
  };

  const registerForPushNotificationsAsync = async () => {
    if (permissions !== "granted") {
      console.log("Permissions not granted");
      return;
    }

    if (!Device.isDevice) {
      console.log("Not a physical device");
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.log("No project ID found");
      return;
    }

    try {
      console.log("Requesting push token with project ID:", projectId);
      const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log("Push token obtained:", pushToken);
      return pushToken;
    } catch (e) {
      console.log("Failed to get the token:", e);
      return;
    }
  };

  const scheduleNotification = (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput
  ) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger,
    });
  };

  console.log("Push token: ", pushToken);
  console.log("Push token: ", pushToken);

  return (
    <NotificationsContext.Provider value={{ scheduleNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}
