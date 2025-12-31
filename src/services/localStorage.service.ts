// src/services/localStorage.service.ts
import { createMMKV } from "react-native-mmkv";
import { BlogPost } from "../models/BlogPost";

const storage = createMMKV();

const POSTS_KEY = "POSTS";
const QUEUE_KEY = "SYNC_QUEUE";

export const getPosts = (): BlogPost[] => {
  const data = storage.getString(POSTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePosts = (posts: BlogPost[]) => {
  storage.set(POSTS_KEY, JSON.stringify(posts));
};

export const getQueue = () => {
  const data = storage.getString(QUEUE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveQueue = (queue: any[]) => {
  storage.set(QUEUE_KEY, JSON.stringify(queue));
};

/* Comments */
export const getComments = (postId: string): Comment[] => {
  const raw = storage.getString(`comments_${postId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveComments = (postId: string, comments: Comment[]) => {
  storage.set(`comments_${postId}`, JSON.stringify(comments));
};