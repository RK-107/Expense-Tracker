import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServie";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {

        const { id, type, walletId, amount, image } = transactionData;
        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Invalid transaction data!" };
        }
        if (id) {
            // eer mane transaction er id ager thekei ase amader transaction update korte hobe

            const oldTransactionSnapshot = await getDoc(doc(firestore, "transactions", id));
            const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
            const shouldRevertOrignal = oldTransaction.type != type || oldTransaction.amount != amount || oldTransaction.walletId != walletId;
            if (shouldRevertOrignal) {
                let res = await revertAndUpdateWallets(oldTransaction, Number(amount), type, walletId);
                if (!res.success) {
                    return res;
                }
            }


        } else {
            //wallet update for new transaction
            let res = await updateWalletForNewTransaction(
                walletId!,
                Number(amount!),
                type
            );
            if (!res.success) return res;

        }

        if (image) {
            const imageUploadRes = await uploadFileToCloudinary(image, "transactions");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Failed to Upload reciept" };

            };
            transactionData.image = imageUploadRes.data;

        }
        const transactionRef = id
            ? doc(firestore, "transactions", id)
            : doc(collection(firestore, "transactions"))

        await setDoc(transactionRef, transactionData, { merge: true });

        return { success: true, data: { ...transactionData, id: transactionRef.id } }

    } catch (err: any) {
        console.log("Error creating or  Updating transaction ", err);
        return { success: false, msg: err.message }
    }
};

const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string,
) => {
    try {
        const walletRef = doc(firestore, "wallets", walletId)
        const walletSnap = await getDoc(walletRef)

        if (!walletSnap.exists()) {
            console.log("Error Updating wallet for new transaction  transaction ");
            return { success: false, msg: "Wallet not found " }
        }
        const walletData = walletSnap.data() as WalletType;

        if (type == "expense" && walletData.amount! - amount < 0) {
            return { success: false, msg: "Selected Wallet dont have enough balance " }
        }
        const updateType = type == "income" ? "totalIncome" : "totalExpenses";

        const updatedWalletAmount = type == 'income'
            ? Number(walletData.amount) + amount
            : Number(walletData.amount) - amount;



        const updatedTotals = type == 'income'
            ? Number(walletData.totalIncome) + amount
            : Number(walletData.totalExpenses) + amount;

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals,
        });


        return { success: true }
    } catch (err: any) {
        console.log("Error Updating wallet for new transaction  transaction ", err);
        return { success: false, msg: err.message }
    }
};

const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string

) => {
    try {
        const OrignalWalletSnapshot = await getDoc(
            doc(firestore, "wallets", oldTransaction.walletId
            ));

        const orignalWallet = OrignalWalletSnapshot.data() as WalletType;
        let newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId
            ));

        let newWallet = newWalletSnapshot.data() as WalletType;
        const revertType = oldTransaction.type == 'income' ? "totalIncome" : "totalExpenses";

        const revertIncomeExpense: number = oldTransaction.type == 'income'
            ? -Number(oldTransaction.amount)
            : Number(oldTransaction.amount)

        const revertedWalletAmount = Number(orignalWallet.amount) + revertIncomeExpense  //eita wallet amount transaction remove korar por



        const revertedIncomeExpenseAmount = Number(orignalWallet[revertType]) - Number(oldTransaction.amount);



        if (newTransactionType == 'expense') {
            //if user tries to convert income to expense on the same wallet 
            // or uf the user tries to increase the expense amount and dont have enoguh balance

            if (oldTransaction.walletId == newWalletId && revertedWalletAmount < newTransactionAmount) {
                return { success: false, msg: "The Selected Wallet don't have enough balance" }
            }

            // user jodi expense ak wallet theke onno wallet e shift kore but oi wallet e jothesto tk nai
            if (newWallet.amount! < newTransactionAmount) {
                return { success: false, msg: "The Selected Wallet don't have enough balance" }
            }
        }

        await createOrUpdateWallet({
            id: oldTransaction.walletId,
            amount: revertedWalletAmount,
            [revertType]: revertedIncomeExpenseAmount
        })

        // revert Completed

        //-----------------------------------------------------------------------------------//

        //refetch the new wallet because we may have just updated it
        newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId
            ));

        newWallet = newWalletSnapshot.data() as WalletType;

        const updateType = newTransactionType == 'income' ? "totalIncome" : "totalExpenses";

        const updatedTransactionAmount: number = newTransactionType == 'income'
            ? Number(newTransactionAmount)
            : -Number(newTransactionAmount);
        const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

        const newIncomeExpenseAmount = Number(
            newWallet[updateType]! + Number(newTransactionAmount)
        );
        await createOrUpdateWallet({
            id: newWallet.id,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });




        return { success: true };
    } catch (err: any) {
        console.log("Error Updating wallet for new transaction  transaction ", err);
        return { success: false, msg: err.message }
    }
};

export const deleteTransaction = async (transactionId: string, walletId: string) => {
    try {

        const transactionRef=doc(firestore, "transactions", transactionId);
        const TransactionSnapshot = await getDoc(doc(firestore, "transactions", transactionId));
        if (!TransactionSnapshot.exists()) {
            return { success: false, msg: "Transaction not found" }
        }
        const transactionData = TransactionSnapshot.data() as TransactionType;
        const transactionType = transactionData?.type;
        const transactionAmount = transactionData?.amount;


        //fetch wallet data
        const walletSnapshot = await getDoc(
            doc(firestore, "wallets", walletId
            ));

        const WalletData = walletSnapshot.data() as WalletType;

        // check Fields to be updated based on transaction type
        const updateType=transactionType=='income'?"totalIncome":"totalExpenses";
        const newWalletAmount=WalletData?.amount!-(transactionType=='income'? transactionAmount:-transactionAmount)

        const newIncomeExpenseAmount=WalletData[updateType]!-transactionAmount;

        // if its expense and the wallet amount goes below zero
        if(transactionType=='income' && newWalletAmount < 0){
            return{success:false,msg:"You can not delete this transaction"}
        }

        await createOrUpdateWallet({
            id:walletId,
            amount:newWalletAmount,
            [updateType]:newIncomeExpenseAmount
        });

        await deleteDoc(transactionRef)


        return { success: true };
    } catch (err: any) {
        console.log("Error Updating wallet for new transaction  transaction ", err);
        return { success: false, msg: err.message }
    }

}