import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServie";

export const updateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try {
        //Image 
        if (updatedData.image && updatedData?.image?.uri) {
            const imageUploadRes = await uploadFileToCloudinary(updatedData.image, "users");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Failed to Upload Image" };

            };
            updatedData.image = imageUploadRes.data;

        }
        const userRef = doc(firestore, "users", uid)
        await updateDoc(userRef, updatedData)

        return { success: true, msg: "updated Successfully" };
    }
    catch (error: any) {
        console.log("Error Updating The User ", error);
        return { success: false, msg: error.message }
    }
}