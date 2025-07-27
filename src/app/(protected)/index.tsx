import { Button, FlatList } from "react-native";
import FeedPostItem from "@/components/FeedPostItem";
import dummyPosts from "@/dummyPosts";
import { Link } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export default function App() {
  const { signOut } = useAuth();
  return (
    <FlatList
      data={dummyPosts}
      renderItem={({ item }) => (
        <Link href={`/post/${item.id}`}>
          <FeedPostItem post={item} />
        </Link>
      )}
      ListFooterComponent={() => <Button onPress={signOut} title="Sign out" />}
    />
  );
}
