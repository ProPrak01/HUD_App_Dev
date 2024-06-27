import { View, Text,Image, ScrollView, Alert } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/customButton'
import {Link, router} from 'expo-router'
import { createUser } from '../../lib/appwrite'
import {useGlobalContext} from '../../context/GlobalProvider'

const SingUp = () => {
  
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitted,setSubmitting] = useState(false);


  const [form,setForm] = useState({
    username:'',
    email:'',
    password:''
  })
  const submit = async ()=>{
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try{
     // console.log('pressed');
      console.log('working1s');
      const result = await createUser(form.email,form.password,form.username);
      setUser(result);
      setIsLoggedIn(true);
      console.log('working2s');
    //  console.log('pressesd2');
      //use it in global state::
      
      router.replace("/home")
    }catch(error){
      Alert.alert("Error",error.message)
      
    }finally{
      setSubmitting(false);
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
<Text className="text-2xl text-black text-semibold mt-10 font-psemibold">Sign up to HUD</Text>
<FormField
    title="Name"
    value={form.username}
    handleChangeText = {(e) => setForm({ ...form,
    username: e})}
    otherStyles="mt-10"
    keyboardType="email-address"
  />

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
    title="Sign Up"
    handlePress = {submit}
    containerSyles="mt-7"
    isLoading={isSubmitted}    
  />
  <View className="justify-center pt-5 flex-row gap-2">
      <Text className="text-lg text-gray-100">
        Have an account already ?
      </Text>
      <Link href="/sign-in" className='text-lg font-psemibold text-green-500'>Sign In</Link>
  </View>
  
  </View>

  
</ScrollView>
    </SafeAreaView>
  )
}

export default SingUp