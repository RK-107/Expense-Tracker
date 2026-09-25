import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageServie";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
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

};
export const deleteWallet=async (walletId:string):Promise<ResponseType>=>{
   try{
    const walletRef=doc(firestore,"wallets",walletId);
    await deleteDoc(walletRef);

    // ekhane Walllet er sob transection gulo delete kora hobe ,pore
    deleteTransactionsByWallet(walletId);

    return{success:true,msg:"Wallet Deleted Successfully"}

   }catch(err:any){
    console.log("Error Deleting Wallet ", err);
    return{success:false,msg:err.message}
   }
}
export const deleteTransactionsByWallet=async (walletId:string):Promise<ResponseType>=>{
   try{
    let hasMoreTransaction=true;
    while(hasMoreTransaction){
        const transactionQuary=query(
            collection(firestore,'transactions'),
            where('walletId','==',walletId)
        );

        const transactionsSnapshot=await getDocs(transactionQuary)
        if(transactionsSnapshot.size==0){
            hasMoreTransaction=false;
            break;
        }

        const batch=writeBatch(firestore);
        transactionsSnapshot.forEach((transactionDoc)=>{
            batch.delete(transactionDoc.ref);
        })
        await batch.commit(); 
        // console.log(`${transactionsSnapshot.size} transactions deleted in this batch ` )
    }
    
    return{success:true,msg:"All the transaction deleted Successfully"}

   }catch(err:any){
    console.log("Error Deleting Wallet ", err);
    return{success:false,msg:err.message}
   }
}