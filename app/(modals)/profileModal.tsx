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
import { UserDataType } from '@/types'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/service/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from "expo-image-picker"

const profileModal = () => {
    const router = useRouter()
    const { user, updateUserData } = useAuth();
    const [userData, setUserData] = useState<UserDataType>({
        name: "",
        image: null,
    })
    const [loading, setIsLoading] = useState(false)
    useEffect(() => {
        setUserData({
            name: user?.name || "",
            image: user?.image || null
        })
    }, [user]);
    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result.assets[0]);

        if (!result.canceled) {
            setUserData({...userData,image:result.assets[0]})
        }

    }
    const onsubmit = async () => {
        let name = userData.name;
        let image = userData.image;
        if (!name.trim()) {
            Alert.alert("User", "Please fill all the fields");
            return;
        }
        setIsLoading(true);
        const res = await updateUser(user?.uid as string, userData);
        setIsLoading(false)
        if (res.success) {
            // User Update hosie
            updateUserData(user?.uid as string);
            router.back();

        } else {
            Alert.alert("User", res.msg);
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title='Update Profile' leftIcon={<BackButton></BackButton>} style={{ marginBottom: spacingY._10 }} />
                {/* Ekhane Amra name and Avaatar Change er Form Dibo */}
                <ScrollView contentContainerStyle={styles.form}>
                    {/* Eta Avatar Container */}
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={getProfileImage(userData.image)}
                            contentFit='cover'
                            transition={100}
                        />
                        <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                            <Icons.Pencil
                                size={verticalScale(20)}
                                color={colors.neutral800}
                            />
                        </TouchableOpacity>

                    </View>
                    {/* Eta Name Container */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>
                            Name

                        </Typo>
                        <Input placeholder='Name'
                            value={userData.name}
                            onChangeText={value => {
                                setUserData({ ...userData, name: value })

                            }}
                        >
                        </Input>

                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <Button onPress={onsubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={"700"} size={18}>
                        Update
                    </Typo>
                </Button>

            </View>
        </ModalWrapper>
    )
}

export default profileModal

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