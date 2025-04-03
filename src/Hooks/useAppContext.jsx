import { use } from "react";
import { AppContext } from "../Context/AppContext";

const useAppContext = () => {
    // return useContext(AppContext)
    const context = use(AppContext) // with new "use" api
    if (context === undefined) {
        throw new Error("useAppContext must be used within a AppContextProvider")
    }
    return context
}
export default useAppContext