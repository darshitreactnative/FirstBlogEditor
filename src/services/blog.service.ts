/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/blog.service.ts
import NetInfo from "@react-native-community/netinfo";
import { get, ref, set } from "firebase/database";
import { auth, realtimeDb } from "../firebase";
import { BlogPost } from "../models/BlogPost";
import {
  getPosts,
  getQueue,
  savePosts,
  saveQueue,
} from "./localStorage.service";

// Remove local-only fields before Firebase
const removeLocalFields = (post: BlogPost) => {
  const { syncStatus, ...data } = post;
  return data;
};

// Merge post into local list 
const mergeLocalPost = (post: BlogPost) => {
  const existing = getPosts();
  const map = new Map(existing.map(p => [p.id, p]));
  map.set(post.id, post);
  savePosts(Array.from(map.values()));
};

export const saveBlogPost = async (post: BlogPost) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const postRef = ref(realtimeDb, `posts/${post.id}`);

  const enriched: BlogPost = {
    ...post,
    authorId: post.authorId || user.uid,
    lastEditedBy: user.uid,
    updatedAt: Date.now(),
    version: (post.version || 0) + 1,
    syncStatus: "pending",
    collaborators: {
      ...(post.collaborators || {}),
      [user.uid]: true
    }
  };
  mergeLocalPost(enriched);
  const net = await NetInfo.fetch();
  if (!net.isConnected || !net.isInternetReachable) {
    saveQueue([...getQueue(), { type: "UPSERT", payload: enriched }]);
    return;
  }

  try {
    const snap = await get(postRef);
    if (snap.exists()) {
      const existing: BlogPost = snap.val();
      enriched.authorId = existing.authorId;
      enriched.collaborators = {
        ...existing.collaborators,
        [user.uid]: true
      };
    }
    await set(postRef, removeLocalFields(enriched));
    markAsSynced(enriched.id);
  } catch (err) {
    saveQueue([...getQueue(), { type: "UPSERT", payload: enriched }]);
  }
};

const markAsSynced = (id: string) => {
  savePosts(
    getPosts().map(p =>
      p.id === id ? { ...p, syncStatus: "synced" } : p
    )
  );
};
