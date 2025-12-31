// src/screens/BlogEditorScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { getQueue, savePosts, saveQueue } from "../services/localStorage.service";
import { postsAtom } from "../store/atoms";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function BlogEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [posts, setPosts] = useAtom(postsAtom);

  const post = params.post ? JSON.parse(params.post as string) : null;

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");

  const save = () => {
    const updated = {
      ...(post || {}),
      id: post?.id ?? generateId(),
      title,
      content,
      updatedAt: Date.now(),
      version: (post?.version || 0) + 1,
      syncStatus: "pending",
    };

    const nextPosts = post
      ? posts.map(p => (p.id === updated.id ? updated : p))
      : [updated, ...posts];

    setPosts(nextPosts);
    savePosts(nextPosts);

    const queue = getQueue();
    saveQueue([...queue, { type: "UPSERT_POST", payload: updated }]);

    router.back();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ borderWidth: 1, height: 150, marginBottom: 12 }}
      />
      <Button title="Save Post" onPress={save} />
    </View>
  );
}
