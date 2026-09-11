import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/Theme'
import { TypoProps } from '@/types'
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import { verticalScale } from '@/Utilites/Styles'

const Typo = ({
    size,
    color=colors.text,
    fontWeight='400',
    children,
    style,
    textProps={}


}:TypoProps) => {
     const textStyle : TextStyle={
        fontSize:size?verticalScale(size):verticalScale(18),
        color,
        fontWeight,
     }
  return (
    
      <Text style={[textStyle,style]} {...textProps}>{children}</Text>
   
  )
}

export default Typo

const styles = StyleSheet.create({})