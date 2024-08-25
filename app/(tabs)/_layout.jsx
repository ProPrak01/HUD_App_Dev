import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className={"items-center justify-center gap-2"}>
      <Image
        source={icon}
        resizeMod="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold text-[#000000]" : "font-pregular text-white"} text-xs`}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#16BB56",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 86,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name={"Home"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name={"Map"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "IOT",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name={"Test IOT Device"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name={"Profile"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
