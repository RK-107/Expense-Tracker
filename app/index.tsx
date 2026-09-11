import { colors } from '@/constants/Theme';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from "expo-router";


const index = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push('/(auth)/welcome')
  //   }, 2000);

  // }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.logo} resizeMode="contain" source={require("../assets/images/Final_At_Last.png")} />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: '20%',
    aspectRatio: 1,
    borderRadius: 30,
  }

})