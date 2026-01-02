/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/syncEngine.service.ts
import NetInfo from "@react-native-community/netinfo";
import { get, ref, update } from "firebase/database";
import { auth, realtimeDb } from "../firebase";
import {
  getPosts,
  getQueue,
  savePosts,
  saveQueue
} from "./localStorage.service";

// Posts sanitizer 
const sanitize = (post: any, userId: string, userName: string) => {
  const clean = { ...post };

  clean.authorId = clean.authorId || userId;
  clean.authorName = clean.authorName || userName;

  clean.lastEditedBy = userId;
  clean.lastEditedByName = userName;

  clean.updatedAt = Date.now();

  clean.collaborators = clean.collaborators || {};
  clean.collaboratorNames = clean.collaboratorNames || {};

  clean.collaborators[userId] = true;
  clean.collaboratorNames[userId] = userName;

  delete clean.syncStatus;
  delete clean.localOnly;

  Object.keys(clean).forEach(k => {
    if (clean[k] === undefined) delete clean[k];
  });

  return clean;
};

// Sync posts queue 
export const processSyncQueue = async () => {
  const net = await NetInfo.fetch();
  if (!net.isConnected || net.isInternetReachable === false) return;

  const user = auth.currentUser;
  if (!user) return;

  const queue = getQueue();
  if (!queue.length) return;

  const remaining: any[] = [];

  for (const item of queue) {
    try {
      if (!item.payload?.id) continue;

      const postRef = ref(realtimeDb, `posts/${item.payload.id}`);
      const snap = await get(postRef);

      let payload = sanitize(
        item.payload,
        user.uid,
        user.displayName || "Unknown"
      );

      if (snap.exists()) {
        const existing = snap.val();
        payload.authorId = existing.authorId;
        payload.authorName = existing.authorName;
        payload.collaborators = {
          ...existing.collaborators,
          ...payload.collaborators
        };
      }

      // update
      await update(postRef, payload);

      savePosts(
        getPosts().map(p =>
          p.id === payload.id ? { ...p, syncStatus: "synced" } : p
        )
      );
    } catch (err) {
      // console.error("SYNC → Upload FAILED:", err);
      remaining.push(item);
    }
  }

  saveQueue(remaining);
  // console.log("SYNC → DONE");
};