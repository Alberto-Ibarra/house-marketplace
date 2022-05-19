import {useEffect, useState} from 'react'
import { getAuth, updateProfile } from "firebase/auth"
import { updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import {toast} from 'react-toastify'



const Profile = () => {
    const auth = getAuth()
    const [changeDetails, setChangeDetials] = useState(false)
    const [formData, setFormData] = useState({
        //when looking in devtools components, user name and email will be in state
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    const {name, email} = formData

    const navigate = useNavigate()

    //logout user
    const onLogout =() => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if(auth.currentUser.displayName !== name){
                //Update display name in firebase
                await updateProfile(auth.currentUser,{
                    displayName: name
                })

                //Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            console.log(error);
            toast.error('could not update profile!')
        }
    }

    const onChange = (e) => {
        setFormData((prevState)=> ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    return <div>
        <header className="profileHeader">
            <p className="pageHeader">My Profile</p>
            <button type='button' className="logOut" onClick={onLogout}>Logout</button>
        </header>

        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Personal Details</p>
                <p className="changePersonalDetails" onClick={()=>{
                    changeDetails && onSubmit()
                    setChangeDetials((prevState) => !prevState)

                }}>
                    {changeDetails ? 'done' : 'change'}
                </p>
            </div>

            <div className="profileCard">
                <form>
                    <input 
                    type='text' 
                    id='name' 
                    className={!changeDetails ? 'profileName' : 'profileNameActive'}
                    disabled={!changeDetails}
                    value ={name}
                    onChange={onChange}
                    />
                        <input 
                    type='text' 
                    id='email' 
                    className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                    disabled={!changeDetails}
                    value ={email}
                    onChange={onChange}
                    />
                </form>
            </div>
        </main>
    </div>
}

export default Profile