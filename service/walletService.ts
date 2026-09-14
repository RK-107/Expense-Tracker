import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageServie";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createOrUpdateWallet = async (
    walletData: Partial<WalletType>
): Promise<ResponseType> => {
    try {
        let walletToSave = { ...walletData };

        if (walletData.image) {
            const imageUploadRes = await uploadFileToCloudinary(walletData.image, "wallets");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Failed to Upload Wallet Icon" };

            };
            walletToSave.image = imageUploadRes.data;

        }
        if(!walletData?.id){
            // new Wallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date();
 
        }

        const walletRef = walletData?.id
            ? doc(firestore, "wallets", walletData?.id)
            : doc(collection(firestore, "wallets"));


            await setDoc(walletRef,walletToSave,{merge:true}) // eta tokhoni update hobe jokhon data provide kora hbe
            return{success:true,data:{...walletToSave,id:walletRef.id}}

    } catch (error: any) {
        console.log("Error creating or Updating Wallet : ", error);
        return { success: false, msg: error.message }
    }

}