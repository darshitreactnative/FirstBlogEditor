// src/services/blogListener.service.ts
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../firebase";
import { savePosts } from "./localStorage.service";

export const listenToBlogs = (setPosts: any) => {
  const postsRef = ref(realtimeDb, "posts");

  const unsubscribe = onValue(postsRef, snapshot => {
    if (!snapshot.exists()) {
      setPosts([]);
      savePosts([]);
      return;
    }

    const data = snapshot.val();

    const posts = Object.values(data).map((post: any) => ({
      ...post,
      syncStatus: "synced"   
    }));
    setPosts(posts);
    savePosts(posts);
  });

  return unsubscribe;
};