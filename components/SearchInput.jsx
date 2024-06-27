import { View, Text, TextInput, TouchableOpacity,Image } from 'react-native'
import React ,{useState} from 'react'
import {icons} from '../constants'
const SearchInput = ({title,value,placeholder,handleChangeText,otherStyles, ...props }) => {
    const [showPassword,setShowPassword] = new useState(false)
  return (
   

      <View className="border-2 border-black-200 w-full space-x-4 h-16 px-4 bg-[#E2E2E2] rounded-2xl focus:border-secondary items-center flex-row" >
    <TextInput
        className="flex-1 text-white text-base mt-0.5 font-pregular"
        value={value}
        placeholder="Search Location"
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        secureTextEntry = {title === 'Password' && !showPassword}
    />

    <TouchableOpacity>
        <Image
            source={icons.dir}
            className='w-7 h-7'
            resizeMode="contain"
        />
    </TouchableOpacity>
      </View>
   
  )
}

export default SearchInput