import { useAuth } from "@/providers/AuthProvider";
import { Slot, Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function ProtectedLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }

  return <Slot />;
}
