/* eslint-disable react-hooks/exhaustive-deps */
// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, useColorScheme, View } from "react-native";
import { auth, initAuth } from "../src/firebase";

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [authChecked, setAuthChecked] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  useEffect(() => {
    initAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserExists(!!user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (userExists) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [authChecked, userExists]);

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
    <Stack>
       <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="blog-editor"
        options={{
          title: "Blog Editor",
          headerShown: true,
        }}
      />
    </Stack>
    </View>
  );
}