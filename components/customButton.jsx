import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'

const CustomButton = ({ title ,handlePress,containerSyles,textStyles, isLoading}) => {
  
  return (
      <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-green-500 rounded-xl min-h-[62px] justify-center items-center ${containerSyles} ${isLoading ? 'opacity-50':''}`}
      disabled={isLoading}>
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
      </TouchableOpacity>
  )
}

export default CustomButton