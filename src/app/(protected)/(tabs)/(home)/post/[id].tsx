import FeedPostItem from "@/components/FeedPostItem";
import { useAuth } from "@/providers/AuthProvider";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { getPost, getPosts } from "@/services/postService";
import { getComments } from "@/services/commentsService";
import Head from "expo-router/head";
import NewCommentInput from "@/components/NewCommentInput";
import CommentsListItem from "@/components/CommentsListItem";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id, session?.accessToken!),
    staleTime: 10 * 1000,
  });

  // const { data: comments, isLoading: commentsLoading } = useQuery({
  //   queryKey: ["comments", id],
  //   queryFn: () => getComments({ post_id: id }, session?.accessToken!),
  //   staleTime: 10 * 1000,
  // });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", id],
    queryFn: ({ pageParam }) => getComments(pageParam, session?.accessToken!),
    initialPageParam: { post_id: id, limit: 10, cursor: undefined },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0 || lastPage.length < 10) {
        return undefined;
      }
      return {
        post_id: id,
        limit: 10,
        cursor: lastPage[lastPage.length - 1].id,
      };
    },
  });

  console.log("Post Comments", { comments });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Post Not found</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Head>
        <title>Tweet from {data.author.name}</title>
        <meta name="description" content={data.content} />
      </Head>

      <View style={{ flex: 1 }}>
        <FeedPostItem post={data} />
        <FlatList
          data={comments?.pages.flat() || []}
          contentContainerClassName="w-full max-w-lg mx-auto"
          renderItem={({ item, index }) => <CommentsListItem comment={item} />}
          keyExtractor={(item, index) => `comment-${item.id}-${index}`}
          ListEmptyComponent={
            <View className="p-4">
              <Text className="text-gray-500 text-center">
                Aucun commentaire pour le moment
              </Text>
            </View>
          }
          onRefresh={refetch}
          refreshing={isRefetching}
          onEndReachedThreshold={2}
          onEndReached={() =>
            !isFetchingNextPage && hasNextPage && fetchNextPage()
          }
          ListFooterComponent={() =>
            isFetchingNextPage && <ActivityIndicator />
          }
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <NewCommentInput postId={id} />
      </KeyboardAvoidingView>
    </View>
  );
}
