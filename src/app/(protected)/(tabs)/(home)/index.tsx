import { Button, FlatList, Pressable } from "react-native";
import FeedPostItem from "@/components/FeedPostItem";
import dummyPosts from "@/dummyPosts";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Post } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: () => {
      return "hello world";
    },
  });

  console.log(data);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data.posts);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`}>
            <FeedPostItem post={item} />
          </Link>
        )}
      />

      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
