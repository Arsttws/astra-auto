import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../store/user/userSlice"
import { useNavigate } from "react-router-dom"

import google from '../assets/google.svg'

import styles from '../styles/modules/auth.module.scss'

export default function OAuth() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = getAuth(app)

    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    googlePhotoUrl: result.user.photoURL
                }),
            })
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }

        } catch (error) {
            console.log(error);  
        }
    }

  return (
    <button type="button" onClick={handleGoogleAuth} className={styles.google}>
        <img src={google} alt="google" />
        <p>Продолжить с Google</p>
    </button>
  )
}
