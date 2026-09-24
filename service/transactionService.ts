import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServie";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
):Promise<ResponseType> => {
    try {

        const { id, type, walletId, amount, image } = transactionData;
        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Invalid transaction data!" };
        }
        if (id) {
            // eer mane transaction er id ager thekei ase amader transaction update korte hobe


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
}