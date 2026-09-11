import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, radius, spacingY } from '@/constants/Theme'
const Wallet = () => {
  return (
    <ScreenWrapper style={{backgroundColor:colors.black}}>
      <Typo>Wallet</Typo>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({
  wallet:{
     flex:1,
     backgroundColor:colors.neutral900,
     borderTopRightRadius:radius._30,
     borderTopLeftRadius:radius._30,
      
  },
  lidtStyle:{
    paddingVertical:spacingY._25,
    paddingTop:spacingY._15,
  }
})