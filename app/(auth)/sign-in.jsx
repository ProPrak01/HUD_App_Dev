import { View, Text,Image, ScrollView, Alert } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/customButton'
import {Link, router} from 'expo-router'
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitted,setisSubmitted] = useState(false);

  const [form,setForm] = useState({
    email:'',
    password:''
  })
  const submit = async ()=>{
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      
    }
    setisSubmitted(true);
    try{
      
    await signIn(form.email,form.password);
    const result = await getCurrentUser();
    setUser(result);
    setIsLoggedIn(true);
    Alert.alert("Success", "User signed in successfully");

      router.replace("/home")
      
    }catch(error){
      Alert.alert("Error",error.message)
      
    }finally{
      setisSubmitted(false);
    }
  }
  return (
    <SafeAreaView className="bg-white h-full">
<ScrollView>
  <View className="w-full justify-center min-h-[85vh] px-4 my-6">
<Image 
  source={images.logo}
  resizeMode='contain'
  className="w-[115px] h-[35px]"
/>
<Text className="text-2xl text-black text-semibold mt-10 font-psemibold">Log in to HUD</Text>
<FormField
    title="Email"
    value={form.email}
    handleChangeText = {(e) => setForm({ ...form,
    email: e})}
    otherStyles="mt-7"
    keyboardType="email-address"
  />

    <FormField
    title="Password"
    value={form.password}
    handleChangeText = {(e) => setForm({...form,
    password: e})}
    otherStyles="mt-7"
  />
  <CustomButton
    title="Sign In"
    handlePress = {submit}
    containerSyles="mt-7"
    isLoading={isSubmitted}    
  />
  <View className="justify-center pt-5 flex-row gap-2">
      <Text className="text-lg text-gray-500">
        Don't have account?
      </Text>
      <Link href="/sign-up" className='text-lg font-psemibold text-green-500'>Sign Up</Link>
  </View>
  
  </View>

  
</ScrollView>
    </SafeAreaView>
  )
}

export default SignIn