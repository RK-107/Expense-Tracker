import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/Theme'
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
import { Dropdown } from 'react-native-element-dropdown';
import { expenseCatagories, transactionTypes } from '@/constants/data'
import useFetchData from '@/hooks/useFetchData'
import { orderBy, where } from 'firebase/firestore'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { createOrUpdateTransaction, deleteTransaction } from '@/service/transactionService'


const transactionModal = () => {
    const router = useRouter()
    const { user } = useAuth();
    const [transaction, setTransaction] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description: "",
        category: "",
        date: new Date(),
        walletId: "",
        image: null
    })

    const [loading, setIsLoading] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { data: wallets, error: walletError, loading: walletLoading } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc"),

    ]);
    type paramType = {
        id: string,
        type: string,
        amount: string,
        catagory: string,
        date: string,
        description: string,
        image?: any;
        uid?: string;
        walletId: string; 
    }
    const oldTransaction: paramType = useLocalSearchParams();
    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || transaction.date;
        setTransaction({ ...transaction, date: currentDate });
        setShowDatePicker(Platform.OS == 'ios' ? true : false);

    }
    // console.log("Old Wallet ", oldTransaction)
    useEffect(() => {
        if (oldTransaction?.id) {
            setTransaction({
                type:oldTransaction.type,
                amount:Number(oldTransaction.amount),
                description:oldTransaction.description || "",
                category:oldTransaction.catagory||"",
                date:new Date(oldTransaction.date),
                walletId:oldTransaction.walletId,
                image: oldTransaction.image

            })
        }

    }, [])

    const onsubmit = async () => {
        const { type, amount, description, category, date, walletId, image } = transaction;
        if (!walletId || !date || !amount || (type == 'expense' && !category)) {
            Alert.alert("Transaction", "Please Fill All the fields");
            return;
        }
        // console.log("good to go");
        let transactionData: TransactionType = {
            type,
            amount,
            description,
            category,
            date,
            walletId,
            image:image? image:null,
            uid: user?.uid

        }
      

        // To do : Include transaction id for updating
        if(oldTransaction?.id){
            transactionData.id=oldTransaction.id;
        }

        setIsLoading(true)

        const res = await createOrUpdateTransaction(transactionData);
        setIsLoading(false)
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Transaction", res.msg)
        }
    }


    const onDelete = async () => {
        // console.log("Deleting the wallet",oldTransaction?.id);
        if (!oldTransaction.id) return;
        setIsLoading(true)
        const res = await deleteTransaction(oldTransaction?.id,oldTransaction?.walletId)
        setIsLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Transaction", res.msg);
        }

    }
    const showDeleteAlert = () => {
        Alert.alert("Confirm",
            "Are you sure you want to delete this transaction?  ",
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
    };


    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title={oldTransaction?.id ? "Update Transaction" : 'New Transaction'}
                    leftIcon={<BackButton></BackButton>}
                    style={{ marginBottom: spacingY._10 }}
                />
                {/* Ekhane Amra name and Avaatar Change er Form Dibo */}
                <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>

                    {/* Drop Down Here  kon type khoros or income */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>
                            Type

                        </Typo>



                        <Dropdown
                            style={styles.dropDownContainer}
                            activeColor={colors.neutral700}
                            // placeholderStyle={styles.dropDwonPlaceholder}
                            selectedTextStyle={styles.dropDownSelectedText}

                            iconStyle={styles.dropDownIcon}
                            data={transactionTypes}

                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={styles.dropDownItemText}
                            itemContainerStyle={styles.dropDownItemContainer}
                            containerStyle={styles.dropDownListContainer}
                            // placeholder={!isFocus ? 'Select item' : '...'}

                            value={transaction.type}

                            onChange={item => {
                                setTransaction({ ...transaction, type: item.value })
                            }}

                        />

                    </View>

                    {/* Drop Down Here wallet er jonno  */}


                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>
                            Wallet
                        </Typo>


                        <Dropdown
                            style={styles.dropDownContainer}
                            activeColor={colors.neutral700}
                            placeholderStyle={styles.dropDwonPlaceholder}
                            selectedTextStyle={styles.dropDownSelectedText}

                            iconStyle={styles.dropDownIcon}
                            data={wallets.map((wallet) => ({
                                label: `${wallet?.name} (${wallet?.amount}৳)`,
                                value: wallet?.id,

                            }))}

                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={styles.dropDownItemText}
                            itemContainerStyle={styles.dropDownItemContainer}
                            containerStyle={styles.dropDownListContainer}
                            placeholder={'Select Wallet'}

                            value={transaction.walletId}

                            onChange={item => {
                                setTransaction({ ...transaction, walletId: item.value || "" })
                            }}

                        />

                    </View>

                    {/* Expese catagoryees er drop down */}


                    {
                        transaction.type == 'expense' && (
                            <View style={styles.inputContainer}>
                                <Typo color={colors.neutral200} size={16}>
                                    Expense Catagory

                                </Typo>



                                <Dropdown
                                    style={styles.dropDownContainer}
                                    activeColor={colors.neutral700}
                                    placeholderStyle={styles.dropDwonPlaceholder}
                                    selectedTextStyle={styles.dropDownSelectedText}

                                    iconStyle={styles.dropDownIcon}
                                    data={Object.values(expenseCatagories)}

                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    itemTextStyle={styles.dropDownItemText}
                                    itemContainerStyle={styles.dropDownItemContainer}
                                    containerStyle={styles.dropDownListContainer}
                                    placeholder={'Select Catagory'}

                                    value={transaction.category}

                                    onChange={item => {
                                        setTransaction({ ...transaction, category: item.value || "" })
                                    }}

                                />

                            </View>
                        )
                    }

                    {/* Date Picker */}

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>
                            Date
                        </Typo>
                        {
                            !showDatePicker && (
                                <Pressable
                                    style={styles.dateInput}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Typo size={14}>{(transaction.date as Date).toLocaleDateString()}</Typo>
                                </Pressable>
                            )
                        }
                        {
                            showDatePicker && (
                                <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                                    <DateTimePicker

                                        value={transaction.date as Date}
                                        themeVariant='dark'
                                        textColor={colors.white}
                                        mode='date'
                                        display={Platform.OS == 'ios' ? "spinner" : "default"}
                                        onChange={onDateChange}

                                    />
                                    {
                                        Platform.OS == 'ios' && (
                                            <TouchableOpacity
                                                style={styles.datePickerButton}
                                                onPress={() => setShowDatePicker(false)}

                                            >
                                                <Typo size={15} fontWeight={'500'}>
                                                    Ok
                                                </Typo>

                                            </TouchableOpacity>
                                        )

                                    }

                                </View>
                            )
                        }

                    </View>

                    {/* Amount input deoar jonno */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>
                            Amount

                        </Typo>
                        <Input

                            value={transaction.amount?.toString()}
                            keyboardType="numeric"
                            onChangeText={value => {
                                setTransaction({ ...transaction, amount: Number(value.replace(/[^0-9]/g, "")) })

                            }}
                        >
                        </Input>

                    </View>
                    {/* Ki dhoroner Expese korsi  */}
                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo color={colors.neutral200} size={16}>
                                Description

                            </Typo>
                            <Typo color={colors.neutral500} size={14}>
                                (Optional)

                            </Typo>

                        </View>

                        <Input

                            value={transaction.description}
                            multiline
                            containerStyle={{
                                flexDirection: "row",
                                height: verticalScale(100),
                                alignItems: "flex-start",
                                paddingVertical: 15,
                            }}
                            onChangeText={value => {
                                setTransaction({ ...transaction, description: value })
                            }}
                        >
                        </Input>

                    </View>

                    <View style={styles.inputContainer}>

                        <View style={styles.flexRow}>
                            <Typo color={colors.neutral200} size={16}>
                                Reciept

                            </Typo>
                            <Typo color={colors.neutral500} size={14}>
                                (Optional)

                            </Typo>

                        </View>
                        {/*  Image Input */}
                        <ImageUpload
                            file={transaction.image}
                            onClear={() => setTransaction({ ...transaction, image: null })}
                            onSelect={file => setTransaction({ ...transaction, image: file })} placeholder='Upload Image' />


                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    oldTransaction?.id && !loading && (
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
                            oldTransaction.id ? "Update " : "Submit"
                        }
                    </Typo>
                </Button>

            </View>
        </ModalWrapper>
    )
}

export default transactionModal

const styles = StyleSheet.create({
    container: {
        flex: 1,

        paddingHorizontal: spacingY._20,

    },

    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,

    },

    form: {
        gap: spacingY._20,
        paddingVertical: spacingY._15,
        paddingBottom: spacingY._40,

    },



    inputContainer: {
        gap: spacingX._10,
    },
    iosdropDown: {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        fontSize: verticalScale(14),
        borderWidth: 1,
        color: colors.white,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,



    },
    androidDropDown: {
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        fontSize: verticalScale(14),
        color: colors.white,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous"

    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._5

    },
    dateInput: {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15

    },
    iosDatePicker: {

    },
    datePickerButton: {
        backgroundColor: colors.neutral700,
        alignSelf: "flex-end",
        padding: spacingY._7,
        marginRight: spacingX._7,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._10,




    },
    dropDownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._15,
        borderCurve: "continuous",



    },
    dropDownItemText: {
        color: colors.white,

    },
    dropDownSelectedText: {
        color: colors.white,
        fontSize: verticalScale(14)
    },
    dropDownListContainer: {
        backgroundColor: colors.neutral900,
        borderRadius: radius._15,
        borderCurve: "continuous",
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,

    },
    dropDwonPlaceholder: {
        color: colors.white

    },
    dropDownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7

    },
    dropDownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral300,
    }

})