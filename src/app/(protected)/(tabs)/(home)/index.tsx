import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  Text,
} from "react-native";
import FeedPostItem from "@/components/FeedPostItem";
import dummyPosts from "@/dummyPosts";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Post } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getPosts } from "@/services/postService";

export default function FeedScreen() {
  const { session } = useAuth();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(session?.accessToken!),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching the posts</Text>;
  }

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`}>
            <FeedPostItem post={item} />
          </Link>
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
      />

      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
