import { ScrollView, Text, View,Image } from "react-native";
import {Redirect,router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '../constants/images'
import CustomButton from '../components/customButton'

import {useGlobalContext} from '../context/GlobalProvider'

export default function Page() {

  const {isLoading,isLoggedIn} = useGlobalContext();
  if(!isLoading && isLoggedIn) return <Redirect href="/home" />
  return (
  <SafeAreaView className="bg-white h-full">
    <ScrollView contentContainerStyle={{height:'100%'}}>
      <View className={"w-full items-center min-h-[85vh] px-4 justify-start"}>
        <Image 
        source={images.logo} 
        className="w-[130px] h-[84px]"
        resizeMode = "contain"
         />
       <Image 
        source={images.cards} 
        className="w-[300px] h-[500px]"
        resizeMode = "contain"
         />
        <View className="relative mt-5">
        <Text className="text-3xl text-black font-bold text-center">Let's Get In
        <Text className="text-[#17C85C]"> HUD</Text>
        </Text>
        <Image 
          source={images.path}
          className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
          resizeMode="contain"
        />
      </View>
      {/* <Text className="text-center text-sm text-gray-700 mt-7 font-pregular">
        ( or )
      </Text> */}
      <CustomButton
      title="Sign In with Your Email"
      handlePress={()=>router.push('/sign-in')}
      containerSyles="w-full mt-7"
       />
      </View>
      
    </ScrollView>

    <StatusBar backgroundColor="#161622" style="light"/>
  </SafeAreaView>
  );
}


