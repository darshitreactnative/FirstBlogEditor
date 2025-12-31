// src/services/comment.service.ts
import { auth } from "../firebase";
import Comment from "../models/Comment";
import { getComments, saveComments } from "./localStorage.service";

export const createComment = (postId: string, text: string): Comment => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const comment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    postId,
    text,
    createdBy: user.uid,
    createdAt: Date.now(),
    syncStatus: "pending",
  };

  const existing = getComments(postId);
  saveComments(postId, [...existing, comment]);

  return comment;
};