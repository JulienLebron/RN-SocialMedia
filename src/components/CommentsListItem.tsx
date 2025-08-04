import { View, Text, ActivityIndicator, Image } from "react-native";
import { Comment } from "@/types/models";

type CommentsListProps = {
  comment: Comment;
};

export default function CommentsListItem({ comment }: CommentsListProps) {
  console.log("Comment", comment);
  console.log("Comment Author", comment.author);
  return (
    <View className="flex-row mt-4 p-3 bg-gray-50 rounded-lg mx-4">
      <Image
        source={{ uri: comment.author.avatar }}
        className="w-9 h-9 rounded-full mr-2"
      />
      <View className="flex-1">
        <View className="mb-2">
          <Text className="font-semibold text-sm">{comment.author.name}</Text>
          <Text className="text-gray-500 text-xs">
            {new Date(comment.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text className="text-gray-800">{comment.content}</Text>
      </View>
    </View>
  );
}
