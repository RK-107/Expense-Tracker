import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Typo from './ui/Typo'
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types'
import { verticalScale } from '@/Utilites/Styles'
import { colors, radius, spacingX, spacingY } from '@/constants/Theme'
import { FlashList } from '@shopify/flash-list';
import Loading from './ui/Loading'
import { expenseCatagories, incomeCatagory } from '@/constants/data'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Timestamp } from 'firebase/firestore'
import { useRouter } from 'expo-router'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage
}: TransactionListType) => {
    const router=useRouter();

    const handleClick = (item:TransactionType) => {
        // Opens Transaction Details
        router.push({
            pathname:"/(modals)/transactionModal",
            params:{
                id:item?.id,
                type:item?.type,
                amount:item?.amount,
                catagory:item?.category?.toString(),
                date:(item.date as Timestamp)?.toDate()?.toISOString(),
                description:item?.description,
                image:item?.image,
                uid:item?.uid,
                walletId:item?.walletId,
            },
        })

    }

    return (
        <View style={styles.container}>
            {
                title && (
                    <Typo size={20} fontWeight={'500'}>
                        {title}
                    </Typo>
                )
            }
            <View style={styles.list}>
                <FlashList
                    data={data}
                    renderItem={({ item, index }) => (
                        <TransactionItem item={item} index={index} handleClick={handleClick} />
                    )}

                />

            </View>

            {
                !loading && data.length == 0 && (
                    <Typo size={15} color={colors.neutral400} style={{ textAlign: 'center', marginTop: spacingY._15 }}>
                        {emptyListMessage}
                    </Typo>

                )

            }
            {
                loading && (
                    <View style={{ top: verticalScale(100) }}>
                        <Loading />
                    </View>
                )
            }
        </View>
    )
}
const TransactionItem = ({
    item,
    index,
    handleClick
}: TransactionItemProps) => {
    // console.log("item description",item.description)
    let catagory = item.type == 'income' ? incomeCatagory : expenseCatagories[item.category!]
    // console.log("catagory",catagory);
    const IconComponent = catagory.icon;
    const date=(item?.date as Timestamp)?.toDate()?.toLocaleDateString("en-GB",{
        day:"numeric",
        month:"short"
        
    })
    return <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(30)}>
        <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
            <View style={[styles.icon, { backgroundColor: catagory.bgColor }]} >
                {
                    IconComponent && (
                        <IconComponent
                            size={verticalScale(25)}
                            weight='fill'
                            color={colors.white}
                        />

                    )
                }

            </View>
            <View style={styles.catagoryDes}>
                <Typo size={17}>
                    {catagory.label}
                </Typo>
                <Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
                    {item.description}
                </Typo>

            </View>
            <View style={styles.amountDate}>
                <Typo fontWeight={"500"} color={item?.type == 'income' ? colors.ujjolgreen : "#F51C1C"}>
                    {item?.type == 'income' ? `+${item.amount}` : `-${item.amount}`}৳
                </Typo>
                <Typo size={13} color={colors.neutral400}>
                    {date}
                </Typo>
            </View>
        </TouchableOpacity>
    </Animated.View>

}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17,

    },
    list: {
        minHeight: 3,

    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._12,

        // List With Background

        backgroundColor: colors.neutral800,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._17

    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: radius._12,
        borderCurve: "continuous",

    },
    catagoryDes: {
        flex: 1,
        gap: 2.5

    },
    amountDate: {
        alignItems: "flex-end",
        gap: 3,
    }
})