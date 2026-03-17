import React from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Todos",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"checkbox-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="PlannerPage"
        options={{
          title: "Planner",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"clipboard-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="RoutinesPage"
        options={{
          title: "Routines",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"brush-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsPage"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"settings-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
