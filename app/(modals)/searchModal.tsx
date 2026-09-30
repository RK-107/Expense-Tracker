import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, spacingX, spacingY } from '@/constants/Theme'
import { scale, verticalScale } from '@/Utilites/Styles'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/ui/BackButton'
import { Image } from 'expo-image'
import { getProfileImage } from '@/service/imageServie'
import * as Icons from "phosphor-react-native"
import Input from '@/components/ui/Input'
import { TransactionType, UserDataType, WalletType } from '@/types'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/service/userService'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"
import ImageUpload from '@/components/imageUpload'
import { createOrUpdateWallet, deleteWallet } from '@/service/walletService'
import { limit, orderBy, where } from 'firebase/firestore'
import useFetchData from '@/hooks/useFetchData'
import TransactionList from '@/components/TransactionList'

const SeachModal = () => {
    const router = useRouter()
    const { user, updateUserData } = useAuth();

    const [loading, setIsLoading] = useState(false)
    const [search, SetSearch] = useState("");
    const constrains = [
        where("uid", "==", user?.uid),
        orderBy("date", "desc"),

    ];
    const { data: allTransactions, error, loading: transactionLoading } = useFetchData<TransactionType>("transactions", constrains);


    const filteredTransactions = allTransactions.filter((item) => {
        if (search.length > 1) {
            if (
                item.category?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) ||
                item.type?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) ||
                item.description?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase())

            ){
                return true
            }
            return false

        }
        return true
    })


    return (
        <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
            <View style={styles.container}>
                <Header title={"Search"} leftIcon={<BackButton></BackButton>} style={{ marginBottom: spacingY._10 }} />
                {/* Ekhane Amra name and Avaatar Change er Form Dibo */}
                <ScrollView contentContainerStyle={styles.form}>

                    {/* Eta Name Container */}
                    <View style={styles.inputContainer}>

                        <Input placeholder='Shoes..'
                            value={search}
                            placeholderTextColor={colors.neutral400}
                            containerStyle={{ backgroundColor: colors.neutral800 }}
                            onChangeText={(value) => {
                                SetSearch(value)

                            }}

                        >
                        </Input>

                    </View>
                    <View>
                        <TransactionList
                            loading={transactionLoading}
                            data={filteredTransactions}
                            emptyListMessage='No transactions match your search keyword'
                        >

                        </TransactionList>
                    </View>

                </ScrollView>
            </View>


        </ModalWrapper>
    )
}

export default SeachModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,

    },


    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,

    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",

    },

    inputContainer: {
        gap: spacingX._10,
    }
})