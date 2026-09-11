import { StyleSheet, Text, View } from 'react-native'
import React, { use } from 'react'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { colors } from '@/constants/Theme'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ui/ScreenWrapper'

const Home = () => {
  const {user}=useAuth();
  // console.log("User : ",user);
  // const handleLogout=async()=>{
  //   await signOut(auth);
  // }
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
      {/* <Button onPress={handleLogout}>
        <Typo color={colors.black} fontWeight={"700"}>Logout</Typo>
      </Button> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})