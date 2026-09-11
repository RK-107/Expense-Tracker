import { AuthContextType, UserType } from "@/types";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, use, useContext, useEffect, useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/config/firebase";
import { User } from "phosphor-react-native";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";



const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {

            console.log('firebase User: ', firebaseUser);
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName
                });
                updateUserData(firebaseUser.uid);
                router.replace("/(tabs)" as any);

            } else {
                // No Users
                setUser(null);
                router.replace('/(auth)/welcome');
            }
        })
        return () => unsub();

    }, [])
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            let msg = error.message;
            console.log("Error massege : ", msg);
            if (msg.includes("(auth/invalid-credential)")) {

                msg = "Wrong Information :(";
            }
            if (msg.includes("Error (auth/invalid-email)")) {

                msg = "Invalid Email Address :(";
            }
            return { success: false, msg }
        }

    }
    const register = async (email: string, password: string, name: string) => {
        try {
            let response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(
                doc(firestore, "users", response.user.uid),
                {
                    name,
                    email,
                    uid: response.user.uid,
                }
            );
            return { success: true };
        } catch (error: any) {
            let msg = error.message;
            console.log("Error massege : ", msg);
            if (msg.includes("Error (auth/invalid-email)")) {

                msg = "Invalid Email Address :(";
            }
            if (msg.includes("(auth/email-already-in-use)")) {
                // console.log("Is it working")
                msg = "This email already has an account! ";
            }
              if (msg.includes("Password should be at least 6 characters (auth/weak-password)")) {
                // console.log("Is it working")
                msg = "PassWord is To weak :( . Set a strong password :) ";
            }


            return { success: false, msg }
        }

    }
    const updateUserData = async (uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data?.uid,
                    email: data.email || null,
                    name: data.name || null,
                    image: data.image || null

                }
                setUser({ ...userData });

            }

        } catch (error: any) {
            let msg = error.message;
            // return { success: false, msg }
            console.log('Error : ', error);
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    }
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )


};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be wrapped inside AuthProvider")
    }
    return context;
}