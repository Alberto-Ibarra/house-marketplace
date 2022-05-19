import { useEffect, useState, useRef } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const useAuthStatus = () => {

    // used for logged in users to access profile page. if not logged in user will be redirected to sign in page
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)
    //useRef below is used to fix memory leak warning
    const isMounted = useRef(true)


    useEffect(()=>{
        if(isMounted){
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if(user){
                    setLoggedIn(true)
                }
                setCheckingStatus(false)
            })
        }

        return () =>{
            isMounted.current = false
        }
    }, [isMounted])

    return {loggedIn, checkingStatus}
}


