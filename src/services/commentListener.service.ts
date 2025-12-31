// src/services/commentListener.service.ts
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../firebase";
import Comment from "../models/Comment";
import { saveComments } from "./localStorage.service";

export const listenToComments = (
  postId: string,
  setComments: (c: Comment[]) => void
) => {
  const commentsRef = ref(realtimeDb, `comments/${postId}`);

  return onValue(commentsRef, snapshot => {
    if (!snapshot.exists()) {
      saveComments(postId, []);
      setComments([]);
      return;
    }

    const data = snapshot.val();
    const comments: Comment[] = Object.values(data).map((c: any) => ({
      ...c,
      syncStatus: "synced",
    }));

    saveComments(postId, comments);
    setComments(comments);
  });
};
