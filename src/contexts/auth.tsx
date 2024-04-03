import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { StorageService } from "../services/storage/auth";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface ContextProps {
    Authenticate: (a: any) => void;
    isAuthenticated: boolean;
    loading: boolean;
    user: any;
    AuthToken: () => string | null
}

export const AuthManager = createContext({} as ContextProps);

const useAuth = () => useContext(AuthManager);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const Authenticate = (data: any) => {
        // setUser(data)
    }

    useEffect(() => {
        if(user){
            setLoading(false)
        }
    }, [user])

    const verifyAuth = async () => {
        setLoading(true)
        await onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
        setLoading(false)
    }

    useEffect(() => {
        verifyAuth();
    }, [])

    const AuthToken = () => {
        if(user){
            return `Bearer ${user?.idToken}` 
        }
        return null
    }
    

    return (
        <AuthManager.Provider value={{
            isAuthenticated: auth.currentUser ? true : false,
            Authenticate,
            loading,
            user,
            AuthToken
        }}>
            {children}
        </AuthManager.Provider>
    )
}

export default useAuth;