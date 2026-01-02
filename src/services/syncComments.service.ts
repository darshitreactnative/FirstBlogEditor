// src/services/syncComments.service.ts
import NetInfo from "@react-native-community/netinfo";
import { ref, set } from "firebase/database";
import { auth, realtimeDb } from "../firebase";
import { getComments, saveComments } from "./localStorage.service";

export const syncComments = async (postId: string) => {
  if (!postId) return;

  const net = await NetInfo.fetch();
  if (!net.isConnected || !net.isInternetReachable) {
    console.log("No internet, cannot sync comments");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in, cannot sync comments");
    return;
  }

  const comments = getComments(postId);
  const pending = comments.filter(c => c.syncStatus === "pending");

  for (const c of pending) {
    try {
      await set(ref(realtimeDb, `comments/${postId}/${c.id}`), {
        ...c,
        syncStatus: "synced",
      });
      console.log("Comment synced:", c.text);
    } catch (err) {
      console.error("SYNC → Comment FAILED:", err);
    }
  }

  // Update local storage
  saveComments(
    postId,
    comments.map(c =>
      c.syncStatus === "pending" ? { ...c, syncStatus: "synced" } : c
    )
  );
};
