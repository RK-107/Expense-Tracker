import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/Theme'
import { verticalScale } from '@/Utilites/Styles'
import Header from '@/components/Header'
import BackButton from '@/components/ui/BackButton'
import { useAuth } from '@/contexts/authContext'
import { Image } from 'expo-image'
import { getProfileImage } from '@/service/imageServie'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
const Profile = () => {
  const { user } = useAuth();
  const router=useRouter();
  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: (
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: "hsl(239, 84%, 67%)",
    },
    {
      title: "Settings",
      icon: (
        <Icons.GearSix
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      // routeName:'/(modals)/profileModal',
      bgColor: "hsl(161, 94%, 30%)",
    },
    {
      title: "Privacy Policy",
      icon: (
        <Icons.Lock
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      // routeName:'/(modals)/profileModal',
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: (
        <Icons.Power
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      // routeName:'/(modals)/profileModal',
      bgColor: "hsla(347, 77%, 50%, 0.90)",
    },
  ]
  const handleLogout=async()=>{
      await signOut(auth);
    }
  const showLogoutAlert=()=>{
    Alert.alert("Confirm","Are You sure you want to logout?",[
      {
        text:"Cancel",
        onPress:()=>console.log("cancel logout"),
        style:"cancel",
      },
      {
        text:"Logout",
        onPress:()=>handleLogout(),
        style:"destructive",
      }
    ])
  }
  const handlePress=(item:accountOptionType)=>{
      if(item.title=='Logout'){
         showLogoutAlert();
      }
      if(item.routeName){
        router.push(item.routeName);
      }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Ekhaner Header Dibo */}
        <Header title='Profile' style={{ marginVertical: spacingY._10 }}>


        </Header>
        {/* Ekhane User Info Relatedd Code  */}
        <View style={styles.userInfo}>
          {/* Ekhane Avatar er Kaj Colbe */}
          <View>
            {/* User Image thakbe  */}
            <Image source={getProfileImage(user?.image)} style={styles.avatar} contentFit="cover" transition={100} />

          </View>
          {/* Ekhane Name ar Email Show Korar Code Likhte hobe  */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>

          </View>
        </View>
        {/* Here will Be Alll the Options in Profile  */}
        <View style={styles.accountOptions}>
          {
            accountOptions.map((item, index) => {
              return (
                <Animated.View entering={FadeInDown.delay(index*50).springify().damping(16)} key={index.toString()} style={styles.listItems}>
                  <TouchableOpacity style={styles.flexRow} onPress={()=>handlePress(item)}>
                    {/* Icon */}
                    <View style={[styles.listIcon, { backgroundColor: item.bgColor }]}>
                      {item.icon && item.icon}

                    </View>
                    <Typo size={16} style={{flex:1}} fontWeight={"500"}>{item.title}</Typo>
                    <Icons.CaretRight
                    size={verticalScale(20)}
                    weight='bold'
                    color={colors.white}
                    />
          
                  </TouchableOpacity>
                </Animated.View>
              )
            })
          }
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,

  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItems: {
    marginBottom: verticalScale(17),

  },
  accountOptions: {
    marginTop: spacingY._35,

  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  }

})