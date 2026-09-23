import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { use } from 'react'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { colors, spacingX, spacingY } from '@/constants/Theme'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import { verticalScale } from '@/Utilites/Styles'
import * as Icons from 'phosphor-react-native';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated'
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'
import { useRouter } from 'expo-router'

const Home = () => {
  const { user } = useAuth();
  const router=useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Heder */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello User
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>

          </View>
          <TouchableOpacity style={styles.searcIcon}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight='bold'
            />
          </TouchableOpacity>

        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* Card */}
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={[1,2,3,4,5,6]}
            loading={false}
            title='Recenect  Transactions'
            emptyListMessage='No Transaction added Yet'
            
          />

        </ScrollView>
        <Button style={styles.floatingButton} onPress={()=>router.push('/(modals)/transactionModal')}>
          <Icons.Plus
          color={colors.black}
          weight='bold'
          size={verticalScale(34)}
          />
        </Button>
      </View>

    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8)

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,

  },
  searcIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,

  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),

  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  }
})