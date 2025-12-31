// app/comments.tsx
import { syncComments } from "@/src/services/syncComments.service";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Comment from "../src/models/Comment";
import { createComment } from "../src/services/comment.service";
import { listenToComments } from "../src/services/commentListener.service";
import { getComments } from "../src/services/localStorage.service";

export default function CommentsScreen() {
  const { blogId, blogTitle } = useLocalSearchParams<{
    blogId: string;
    blogTitle: string;
  }>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!blogId) return;
    setComments(getComments(blogId));
    const unsub = listenToComments(blogId, setComments);
    syncComments(blogId);

    return () => unsub();
  }, [blogId]);

  const send = async () => {
    if (!blogId || !text.trim()) return;
    const newComment = createComment(blogId, text);
    setComments(prev => [...prev, newComment]);
    setText("");
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    await syncComments(blogId);

    setComments(prev =>
      prev.map(c =>
        c.id === newComment.id ? { ...c, syncStatus: "synced" } : c
      )
    );
  };

  const renderItem = ({ item }: { item: Comment }) => {
    const isPending = item.syncStatus === "pending";
    return (
      <View
        style={[
          styles.bubble,
          isPending ? styles.pending : styles.synced,
        ]}
      >
        <Text style={styles.bubbleText}>{item.text}</Text>
        {isPending && <Text style={styles.pendingText}>Sending...</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <Text style={styles.title}>{blogTitle}</Text>

      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={send} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 10,
  },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  synced: {
    backgroundColor: "#d1fcd3",
  },
  pending: {
    backgroundColor: "#ffe6e6",
  },
  bubbleText: {
    fontSize: 16,
  },
  pendingText: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  sendBtn: {
    marginLeft: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  sendBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});