import { colors, spacingX, spacingY } from '@/constants/Theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/Utilites/Styles'
import { orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Typo from './ui/Typo'

const HomeCard = () => {
    const {user}=useAuth();

    const { data: wallets, error, loading:walletLoading } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc"),
    ]);
     const getTotals=()=>{
       return wallets.reduce((totals:any,item:WalletType)=>{
            totals.balance=Number(item.amount)+totals.balance;
            totals.income=Number(item.totalIncome)+totals.income;
            totals.expenses=Number(item.totalExpenses)+totals.expenses;
            return totals; 
        },{balance:0,income:0,expenses:0})
     }
    return (
        <ImageBackground
            source={require('../assets/images/card5.png')}
            resizeMode='stretch'
            style={styles.bgImg}
        >
            <View style={styles.container}>
                <View>
                    {/* Total Balance  */}
                    <View style={styles.totalBalanceRow}>
                        <Typo color={colors.neutral800} size={17} fontWeight={"500"}>Total Balance:</Typo>
                        <Icons.DotsThreeOutline
                            size={verticalScale(23)}
                            color='black'
                            weight='fill' />

                    </View>
                    <Typo color='black' size={30} fontWeight={'bold'}>
                        {walletLoading?"----":getTotals()?.balance?.toFixed(2)} ৳
                    </Typo>
                </View>
                {/* Total expense and Income */}
                <View style={styles.stats}>
                    {/* income */}
                    <View style={{ gap: verticalScale(5) }} >
                        <View style={styles.incomeExpense}>
                            <View style={styles.statsIcon}>
                                <Icons.ArrowDown
                                    size={verticalScale(15)}
                                    color={colors.black}
                                    weight='bold'
                                />
                            </View>
                            <Typo color={colors.neutral700} size={16} fontWeight={'500'}>Income</Typo>

                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Typo size={17} color={colors.green} fontWeight={"600"}>
                                {walletLoading?"----":getTotals()?.income?.toFixed(2)} ৳
                            </Typo>
                        </View>

                    </View>
                    {/* Expense */}
                    <View style={{ gap: verticalScale(5) }} >
                        <View style={styles.incomeExpense}>
                            <View style={styles.statsIcon}>
                                <Icons.ArrowUp
                                    size={verticalScale(15)}
                                    color={colors.black}
                                    weight='bold'
                                />
                            </View>
                            <Typo color={colors.neutral700} size={16} fontWeight={'500'}>Expense</Typo>

                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Typo size={17} color='red' fontWeight={"600"}>
                                 {walletLoading?"----":getTotals()?.expenses?.toFixed(2)} ৳
                            </Typo>
                        </View>

                    </View>

                </View>
            </View>
        </ImageBackground>

    )
}

export default HomeCard

const styles = StyleSheet.create({
    bgImg: {
        height: scale(210),
        width: "100%",
    },
    container: {
        padding: spacingX._20,
        paddingHorizontal: scale(23),
        height: "87%",
        width: "100%",
        justifyContent: "space-between",

    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    totalBalanceRow: {

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY._5

    },


    statsIcon: {
        backgroundColor: colors.neutral350,
        padding: spacingY._5,
        borderRadius: 50,

    },
    incomeExpense: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingY._7
    }
})