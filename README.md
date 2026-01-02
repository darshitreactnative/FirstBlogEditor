# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



# 📝 React Native Take-Home Assignment

## Collaborative Offline-First Blog Editor  
(Firebase + OTA Ready)

---

### 📱 Platform
- iOS

### 🎨 Design
- No Figma provided  
- UI quality is not evaluated

---

## 🎯 Objective

Build a **collaborative, offline-first blog editor** where **multiple users can create and edit blog posts**, even while offline, and **sync changes reliably using Firebase**.

This assignment focuses on **architecture, data consistency, and sync reliability**, not UI design.

---

## 🧪 Evaluation Criteria

- Offline-first architecture
- Real-time collaboration modeling
- Conflict detection and resolution
- Firebase usage discipline
- State management & separation of concerns
- Production-level React Native practices

---

## 🛠 Mandatory Tech Stack

You must use:

- React Native (Expo Dev Client)
- TypeScript
- React Navigation (Native Stack)
- State Management: Jotai
- Local Storage: MMKV
- Firebase
  - Firestore
  - Firebase Authentication
- Network Detection: `@react-native-community/netinfo`
- App Lifecycle: `AppState`

---

## 🔐 Authentication (Firebase Auth)

- Firebase Authentication is used
- User identity is persisted on first launch

```ts
type User = {
  uid: string;
  displayName: string;
};


🧱 Data Models (Must Match)

type BlogPost = {
  id: string;
  title: string;
  content: string;

  authorId: string;
  collaborators: string[];

  updatedAt: number;
  version: number;

  syncStatus: "synced" | "pending" | "error";
  lastEditedBy: string;
};

Comment Model

type Comment = {
  id: string;
  postId: string;
  text: string;

  createdBy: string;
  createdAt: number;

  syncStatus: "synced" | "pending";
};

Sync Queue

type SyncAction = {
  id: string;
  userId: string;
  type: "CREATE" | "UPDATE" | "DELETE" | "COMMENT";
  payload: any;
  timestamp: number;
};


If you want, I can now:
- Adapt this README to **exactly match your implemented architecture**
- Add **Conflict Strategy explanation** text
- Add **Offline Sync Flow** section based on your code