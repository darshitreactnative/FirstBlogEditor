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




























// src/services/blogListener.service.ts
// import { onValue, ref } from "firebase/database";
// import { auth, realtimeDb } from "../firebase";
// import { BlogPost } from "../models/BlogPost";
// import { savePosts } from "./localStorage.service";

// export const listenToBlogs = (onUpdate: (posts: BlogPost[]) => void) => {
//   const user = auth.currentUser;
//   if (!user) return () => {};

//   const postsRef = ref(realtimeDb, `posts/${user.uid}`);

//   return onValue(postsRef, snap => {
//     if (!snap.exists()) {
//       onUpdate([]);
//       return;
//     }

//     const data = snap.val();
//     const posts = Object.values(data).map((p: any) => ({
//       ...p,
//       syncStatus: "synced",
//     }));

//     savePosts(posts as BlogPost[]);
//     onUpdate(posts as BlogPost[]);
//   });
// };




















// import { off, onValue, ref } from "firebase/database";
// import { auth, realtimeDb } from "../firebase";
// import { BlogPost } from "../models/BlogPost";
// import { savePosts } from "./localStorage.service";

// export const listenToBlogs = (onUpdate: (posts: BlogPost[]) => void) => {
//   const user = auth.currentUser;
//   if (!user) {
//     console.warn('No authenticated user found');
//     return () => {}; // Return empty cleanup function
//   }

//   const userPostsRef = ref(realtimeDb, `posts/${user.uid}`);
  
//   const handleValueChange = (snapshot: any) => {
//     try {
//       const postsData = snapshot.val() || {};
//       console.log('Received posts data:', postsData);
      
//       const posts: BlogPost[] = Object.entries(postsData).map(([id, postData]) => ({
//         ...(postData as Omit<BlogPost, 'id' | 'syncStatus'>),
//         id,
//         syncStatus: "synced" as const,
//       }));

//       console.log('Processed posts:', posts);
//       savePosts(posts);
//       onUpdate(posts);
//     } catch (error) {
//       console.error('Error processing posts:', error);
//     }
//   };

//   // Set up the listener
//   onValue(userPostsRef, handleValueChange, (error) => {
//     console.error('Error setting up listener:', error);
//   });

//   // Return cleanup function
//   return () => {
//     console.log('Cleaning up posts listener');
//     off(userPostsRef, 'value', handleValueChange);
//   };
// };