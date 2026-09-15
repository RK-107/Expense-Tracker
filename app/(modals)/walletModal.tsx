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
import { UserDataType, WalletType } from '@/types'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/service/userService'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"
import ImageUpload from '@/components/imageUpload'
import { createOrUpdateWallet, deleteWallet } from '@/service/walletService'

const WalletModal = () => {
    const router = useRouter()
    const { user, updateUserData } = useAuth();
    const [walletData, setWallet] = useState<WalletType>({
        name: "",
        image: null,
    })
    const [loading, setIsLoading] = useState(false)
    const oldWallet: { name: string, image: string, id: string } = useLocalSearchParams();
    // console.log("Old Wallet ", oldWallet)
    useEffect(() => {
        if (oldWallet?.id) {
            setWallet({
                name: oldWallet.name,
                image: oldWallet.image
            })
        }

    }, [])

    const onsubmit = async () => {
        let name = walletData.name;
        let image = walletData.image;
        if (!name.trim() || !image) {
            Alert.alert("Wallet", "Please fill all the fields");
            return;
        }
        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        };
        // To Do : include Wallet Id if Updating
        if (oldWallet.id) data.id = oldWallet.id
        setIsLoading(true);
        const res = await createOrUpdateWallet(data);
        setIsLoading(false)
        // console.log("Result : ",res);
        if (res.success) {

            router.back();

        } else {
            Alert.alert("Wallet", res.msg);
        }
    }


    const onDelete = async () => {
        // console.log("Deleting the wallet",oldWallet?.id);
        if (!oldWallet.id) return;
        setIsLoading(true)
        const res = await deleteWallet(oldWallet?.id)
        setIsLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Wallet", res.msg);
        }

    }
    const showDeleteAlert = () => {
        Alert.alert("Confirm",
            "Are you sure about that\nThis action will remove all the tranaction related to this wallet",
            [
                {
                    text: "Cancel",
                    onPress: () =>
                        console.log("cancel delete"),
                    style: "cancel"

                },
                {
                    text: "Delete",
                    onPress: () =>
                        onDelete(),
                    style: "destructive"

                }
            ]
        )
    }
    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title={oldWallet?.id ? "Update Wallet" : 'New Wallet'} leftIcon={<BackButton></BackButton>} style={{ marginBottom: spacingY._10 }} />
                {/* Ekhane Amra name and Avaatar Change er Form Dibo */}
                <ScrollView contentContainerStyle={styles.form}>

                    {/* Eta Name Container */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>
                            Wallet Name

                        </Typo>
                        <Input placeholder='Salary'
                            value={walletData.name}
                            onChangeText={value => {
                                setWallet({ ...walletData, name: value })

                            }}
                        >
                        </Input>

                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>
                            Wallet Icon

                        </Typo>
                        {/*  Image Input */}
                        <ImageUpload
                            file={walletData.image}
                            onClear={() => setWallet({ ...walletData, image: null })}
                            onSelect={file => setWallet({ ...walletData, image: file })} placeholder='Upload Image' />


                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    oldWallet?.id && !loading && (
                        <Button
                            onPress={showDeleteAlert}

                            style={{
                                backgroundColor: colors.rose,
                                paddingHorizontal: spacingX._15
                            }}>
                            <Icons.Trash
                                color={colors.white}
                                size={verticalScale(24)}
                                weight='bold' />

                        </Button>
                    )
                }
                <Button onPress={onsubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={"700"} size={18}>
                        {
                            oldWallet.id ? "Update Wallet" : "Add Wallet"
                        }
                    </Typo>
                </Button>

            </View>
        </ModalWrapper>
    )
}

export default WalletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,

    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._30,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,

    },

    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,

    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",

    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderBlockColor: colors.neutral500,
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,

    },
    inputContainer: {
        gap: spacingX._10,
    }
})