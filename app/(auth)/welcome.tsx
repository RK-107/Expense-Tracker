import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, spacingX, spacingY } from '@/constants/Theme'
import { verticalScale } from '@/Utilites/Styles'
import Button from '@/components/ui/Button'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated,{FadeIn, FadeInDown} from "react-native-reanimated";
import { useRouter } from 'expo-router'


const Welcome = () => {
  const router=useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Ekhane Login Button ar Image thakbe */}
        <View>
          <TouchableOpacity onPress={()=>router.push('/(auth)/Login')} style={styles.loginButton}>
            <Typo fontWeight={500}>Sign In</Typo>
          </TouchableOpacity>
          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("../../assets/images/WellCome_Image2.jpg")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>
        {/* Ekkhnae Footer */}
        <View style={styles.footer}>
          <Animated.View entering={FadeInDown.duration(1000).springify().damping(18)} style={{ alignItems: 'center' }}>
            <Typo size={25} fontWeight={"800"} >Know Your Money,</Typo>
            <Typo size={25} fontWeight={"800"}>Grow Your Future.</Typo>

          </Animated.View>
          <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(18)} style={{ alignItems: "center", gap: 2 }}>
            <Typo size={14}>Organize your finances today and make smarter choices</Typo>
            <Typo size={14}>for a better lifestyle tomorrow...</Typo>

          </Animated.View>
          <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(18)} style={styles.buttonContainer}>
               {/* Button er kaj */}
               <Button onPress={()=> router.push('/(auth)/Register')}> 
                <Typo size={22} color={colors.neutral900} fontWeight={"600"} >Get Started</Typo>
               </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
    borderRadius: 30,
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,

  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },

});