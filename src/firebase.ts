// // src/firebase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
  signInAnonymously,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7cnuPnguaB5KhRg43rxblV1WrpVdbvLw",
  authDomain: "offline-firstblogeditor.firebaseapp.com",
  projectId: "offline-firstblogeditor",
  databaseURL: "https://offline-firstblogeditor-default-rtdb.firebaseio.com",
  storageBucket: "offline-firstblogeditor.firebasestorage.app",
  messagingSenderId: "450921957584",
  appId: "1:450921957584:web:d087c7fef511ada34cf6d5",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);

let authInitialized = false;

export async function initAuth() {
  if (authInitialized) return;
  authInitialized = true;

  if (!auth.currentUser) {
    console.log("AUTH → No user, signing in anonymously");
    await signInAnonymously(auth);
    console.log("AUTH → Anonymous sign-in success");
  } else {
    console.log("AUTH → User already signed in:", auth.currentUser.uid);
  }
}