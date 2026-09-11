import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, spacingX, spacingY } from '@/constants/Theme'
import Welcome from './welcome'
import { verticalScale } from '@/Utilites/Styles'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import * as Icons from 'phosphor-react-native';
import Button from '@/components/ui/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'


const Register = () => {
    const {register:registerUser}=useAuth();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const nameRef = useRef("");
    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert('Sign up', "Please Fill All Three fields");
            return;
        }
        setIsLoading(true);
        const res=await registerUser(emailRef.current,passwordRef.current,nameRef.current);
        setIsLoading(false);
         console.log("Rgister Result: ",res);
         if(!res.success){
            Alert.alert("Sign Up",res.msg);
         }
    }
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Back Button Lagbe */}
                <BackButton iconSize={28}>

                </BackButton>
                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>
                        Hey,
                    </Typo>
                    <Typo size={30} fontWeight={"800"}>
                        Let’s Start Tracking Your Money
                    </Typo>

                </View>
                {/* Form er part */}
                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Create an Account and Start Tracking Smcleararter
                    </Typo>
                    {/* Ekhane User Login Input Thakbe */}
                    <Input
                        placeholder='Enter Your Name'
                        onChangeText={(value) =>
                            (nameRef.current = value)
                        }
                        icon={<Icons.User size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill' />} >

                    </Input>
                    <Input
                        placeholder='Enter Your Email'
                        onChangeText={(value) =>
                            (emailRef.current = value)
                        }
                        icon={<Icons.At size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill' />} >

                    </Input>
                    <Input
                        placeholder='Enter Your Password'
                        secureTextEntry
                        onChangeText={(value) =>
                            (passwordRef.current = value)
                        }
                        icon={<Icons.Lock size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill' />} >

                    </Input>
                   
                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={'700'} color={colors.black} size={21} >
                            Sign Up
                        </Typo>
                    </Button>
                </View>
                {/* Fotter Area */}
                <View style={styles.footer}>
                    <Typo size={15}>
                        Already Have an account?

                    </Typo>
                    <Pressable onPress={() => router.navigate('/(auth)/Login')}>
                        <Typo size={15} fontWeight={'700'} color={colors.primary}>
                           Login
                        </Typo>
                    </Pressable>

                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text,
    },
    form: {
        gap: spacingY._20,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },

    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15),
    },



})