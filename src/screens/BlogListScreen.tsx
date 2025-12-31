// src/screens/BlogListScreen.tsx
/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import {
  AppState,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase";
import { BlogPost } from "../models/BlogPost";
import { listenToBlogs } from "../services/blogListener.service";
import { getPosts, savePosts } from "../services/localStorage.service";
import { processSyncQueue } from "../services/syncEngine.service";
import { postsAtom } from "../store/atoms";

export default function BlogListScreen() {
  const [posts, setPosts] = useAtom(postsAtom);
  const router = useRouter();

  const blogUnsubRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    setPosts(getPosts());
    const interval = setInterval(() => {
      processSyncQueue();
    }, 5000);

    // Network listener
    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable !== false) {
        processSyncQueue();
      }
    });

    // App foreground listener
    const appStateSub = AppState.addEventListener("change", state => {
      if (state === "active") {
        setPosts(getPosts());
        processSyncQueue();
      }
    });

    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) {
        console.log("AUTH READY → START BLOG LISTENER");
        savePosts([]);
        setPosts([]);
        // Remove old listener if exists
        if (blogUnsubRef.current) {
          blogUnsubRef.current();
        }
        blogUnsubRef.current = listenToBlogs(setPosts);
        processSyncQueue();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribeNet();
      unsubscribeAuth();
      appStateSub.remove();
      if (blogUnsubRef.current) {
        blogUnsubRef.current();
      }
    };
  }, []);

  const renderItem = ({ item }: { item: BlogPost }) => {
    const isSynced = item.syncStatus === "synced";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/blog-editor",
            params: { post: JSON.stringify(item) },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>
            {item.title || "Untitled Blog"}
          </Text>

          <View
            style={[
              styles.statusBadge,
              isSynced ? styles.synced : styles.pending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isSynced ? styles.syncedText : styles.pendingText,
              ]}
            >
              {item.syncStatus}
            </Text>
          </View>
        </View>

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.commentButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname:"/comments",
              params: {blogTitle: item.title, blogId: item.id},
            })
          }
        >
          <Text style={styles.commentButtonText}>💬   Comments</Text>
        </TouchableOpacity>

        <Text numberOfLines={2} style={styles.preview}>
          {item.content || "No content"}
        </Text>

        <Text style={styles.meta}>
          Version {item.version} •{" "}
          {new Date(item.updatedAt).toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/blog-editor")}
      >
        <Text style={styles.addButtonText}>＋ New Blog</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          posts.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No blogs yet</Text>
            <Text style={styles.emptyText}>
              Create a new blog to get started.
            </Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    padding: 14,
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  preview: {
    marginTop: 8,
    fontSize: 14,
    color: "#374151",
  },
  meta: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  synced: {
    backgroundColor: "#DCFCE7",
  },
  pending: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  syncedText: {
    color: "#166534",
  },
  pendingText: {
    color: "#92400E",
  },
  commentButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#a4a6aeff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  commentButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2416baff",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});