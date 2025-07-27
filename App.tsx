import dummyPosts from "@/dummyPosts";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FeedPostItem from "@/components/FeedPostItem";

export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyPosts}
        renderItem={({ item }) => <FeedPostItem post={item} />}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingTop: 80,
  },
});
