import axios from "axios";
import { Children, createContext, useEffect, useState, } from "react";
import { toast } from "react-toastify";
import { getBaseUrl } from "../Helpers";

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true;

    // const serverUrl = import.meta.env.VITE_SERVER_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        getAuthState()
    }, [])

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(`${getBaseUrl()}/api/user/data`)
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${getBaseUrl()}/api/auth/is-auth`)
            if (data.success) {
                setIsLoggedIn(true)
                fetchUserData()
            } else {
                toast.error(data.message || 'Not authorized')
            }
        } catch (error) {
            console.error('Auth error:', error)
            toast.error(error.message)
        }
    }

    const values = {
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        fetchUserData
    }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}