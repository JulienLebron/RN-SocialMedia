import FeedPostItem from "@/components/FeedPostItem";
import dummyPosts from "@/dummyPosts";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const post = dummyPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <Text>Post Not found</Text>;
  }

  return <FeedPostItem post={post} />;
}
