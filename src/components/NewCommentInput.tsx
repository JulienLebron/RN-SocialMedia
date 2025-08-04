import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { createCommentRequest } from "@/services/commentsService";

type NewCommentInputProps = {
  postId: string;
};

export default function NewCommentInput({ postId }: NewCommentInputProps) {
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const commentMutation = useMutation({
    mutationFn: () =>
      createCommentRequest(
        postId,
        { content: inputValue },
        session?.accessToken!
      ),
    onSettled: () => {
      setInputValue("");
      return queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleChangeText = (text: string) => {
    setInputValue(text);
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !commentMutation.isPending) {
      commentMutation.mutate();
    }
  };

  return (
    <View className="flex-row items-center gap-2 px-4 mb-4">
      <TextInput
        value={inputValue}
        onBlur={() => {}}
        onChangeText={handleChangeText}
        style={styles.input}
        placeholder="Add a comment..."
        editable={!commentMutation.isPending}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!inputValue.trim() || commentMutation.isPending}
      >
        <MaterialCommunityIcons
          name="send"
          size={24}
          color={
            inputValue.trim() && !commentMutation.isPending ? "#007AFF" : "gray"
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gainsboro",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginTop: 4,
    marginBottom: 2,
  },
});
