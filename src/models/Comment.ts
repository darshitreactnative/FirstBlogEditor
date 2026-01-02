// src/models/Comment.ts
type Comment = {
  id: string;
  postId: string;
  text: string;

  createdBy: string;
  createdByName: string;
  createdAt: number;

  syncStatus: "synced" | "pending";
};

export default Comment;