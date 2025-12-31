// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Blogs",
          tabBarIcon: ({ color }) => <Text style={{ color }}>📝</Text>,
        }}
      />
    </Tabs>
  );
}
