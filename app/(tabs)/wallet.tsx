import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/Theme'
import { verticalScale } from '@/Utilites/Styles'
import * as Icons from 'phosphor-react-native';
import { useRouter } from 'expo-router'
const Wallet = () => {
  const router=useRouter();
  const getTotalBalance=()=>{
    return 1999;
  }
  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* Balacncce  View */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              {getTotalBalance()?.toFixed(2)}৳
              </Typo>
              <Typo size={16} color={colors.neutral300}>
                Total balance
              </Typo>
   
          </View>
        </View>
        {/* Wallets */}
        <View style={styles.wallet}>
          {/* Header  */}
          <View style={styles.flexrow}>
            <Typo size={20} fontWeight={"500"}>
              My wallets
            </Typo>
            <TouchableOpacity onPress={()=>{
              router.push("/(modals)/walletModal")
            }}>
              <Icons.PlusCircle
              weight='fill'
              color={colors.primary}
              size={verticalScale(33)}
              
              >

              </Icons.PlusCircle>
            </TouchableOpacity>
          </View>
          {/* Wallet Lists ekhane  */}


        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",

  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",

  },
  flexrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,

  },
  lidtStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  }
})