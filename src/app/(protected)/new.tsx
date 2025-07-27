import { router, Stack } from "expo-router";
import { useState } from "react";
import { TextInput, View, Text, Button } from "react-native";

export default function NewPost() {
  const [content, setContent] = useState("");

  const handleCreate = () => {
    // send the post to the backend

    setContent("");
    router.back();
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Text className="text-lg" onPress={() => router.back()}>
              Cancel
            </Text>
          ),
          headerRight: () => (
            <Button
              title="Post"
              onPress={handleCreate}
              disabled={content.trim().length === 0}
            />
          ),
        }}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        className="text-lg min-h-40"
        multiline
        placeholder="What's happening?"
        autoFocus
      />
    </View>
  );
}
