import { createContext, PropsWithChildren, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationsContextType = {};
const NotificationsContext = createContext<NotificationsContextType>({});

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [permissions, setPermissions] =
    useState<Notifications.PermissionStatus | null>(null);

  useEffect(() => {
    ensurePermissions();
  }, []);

  const ensurePermissions = async () => {
    // on Android, we first have to create a channel then ask for permissions
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
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

  return (
    <NotificationsContext.Provider value={{ scheduleNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}
