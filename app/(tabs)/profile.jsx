import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";

const Profile = () => {
  const { user } = useGlobalContext();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text className="text-2xl font-psemibold text-gray-500">
        {user.username}
      </Text>
      <Text className="text-2xl font-psemibold text-gray-500 mt-4">
        {user.email}
      </Text>
    </View>
  );
};

export default Profile;
