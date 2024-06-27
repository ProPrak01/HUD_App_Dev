import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '../../constants/images'
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { useGlobalContext } from "../../context/GlobalProvider";
const Home = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const renderItem = ({ item }) => <Text className="text-3xl text-white">{item.id}</Text>;
  const data = [{ id: "1" }, { id: "2" }, { id: "3" }];
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-500">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-gray-500">{user.username}</Text>
              </View>
              <View className="mt-1.5"><Image
                source={images.logo}
                className="w-9 h-10"
                resizeMode="contain"
              /></View>
            </View>
            <SearchInput/>
            <View className="w-full pt-5 flex-1 pb-8">
            {/* <Text className="text-gray-500 text-lg font-pregular">
           Search for Locations
            </Text> */}

            <Trending post={[{id:1},{id:2},{id:3}] ?? []}/>
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
         <EmptyState
          title="No Videos Found"
          subtitle="Be the first to upload"
         />
        )}
        refreshControl={<RefreshControl/>}
      />
    </SafeAreaView>
  );
};

export default Home;
