import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { 
    getAuth, 
    onAuthStateChanged, 
    updateProfile, 
    deleteUser, 
    signOut, 
    updateEmail, 
    EmailAuthProvider, 
    reauthenticateWithCredential,
    sendEmailVerification
} from 'firebase/auth'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../../../firebase/firebase'
import styles from './index.module.css'

import { FaUser, FaCalendarAlt } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { MdVerifiedUser, MdVerified, MdWarning } from 'react-icons/md'

export default function Account() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [originalUsername, setOriginalUsername] = useState('')
    const [showUsernameInput, setShowUsernameInput] = useState(false)
    const [email, setEmail] = useState('')
    const [showEmailInput, setShowEmailInput] = useState(false)
    const [createdAt, setCreatedAt] = useState('')
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const router = useRouter()

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser)
                setCreatedAt(new Date(firebaseUser.metadata.creationTime).toLocaleString())

                const docRef = doc(db, "users", firebaseUser.uid);
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setUsername(docSnap.data().username || "")
                    setOriginalUsername(docSnap.data().username || "")
                }
                setLoading(false)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    const sendEmailVerificationToUser = async () => {
        const user = auth.currentUser

        if (user && !user.emailVerified) {
            try {
                await sendEmailVerification(user)
                alert("Verification email sent! Please check your inbox and verify your email.")
            } catch (error) {
                console.log("Error sending verification email:", error)
                alert("Failed to send verification email: " + error.message)
            }
        } else {
            alert("Your email is already verified")
        }
    }

    const handleToggleUsernameInput = () => {
        setUsername(username)
        setShowUsernameInput(true)
    }

    const handleUsernameChange = async () => {
        if (!username) return;
        try {
            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, { username })
            setStatus("Username updated sucessfully.")
            setShowUsernameInput(false)
        } catch (error) {
            console.log(error)
            setStatus("Error updating username.")
        }
    }

    const handleToggleEmailInput = () => {
        setEmail(user.email)
        setShowEmailInput(true)
    }

    const handleEmailChange = async () => {
        const user = auth.currentUser;

        await user.reload(); // refresh user data
        if (!auth.currentUser.emailVerified) {
        alert("Please verify your current email address first.");
        return;
        }
      
        if (!user || !email) return;
      
        try {
          const password = prompt("Please enter your password to confirm email change:");
      
          if (!password) throw new Error("Password is required to reauthenticate.");
      
          const credential = EmailAuthProvider.credential(user.email, password);
      
          await reauthenticateWithCredential(user, credential);
      
          await updateEmail(user, email);
          setStatus("Email updated successfully!");
          setShowEmailInput(false);
        } catch (err) {
          console.error("Failed to update email:", err.message);
          alert("Failed to update email: " + err.message);
        }
      };

    const handleDeleteAccount = async () => {
        const auth = getAuth()
        const currentUser = auth.currentUser

        if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "users", currentUser.uid))
                await deleteUser(currentUser)
                setStatus("Account deleted.")
            } catch (error) {
                console.log(error)
                setStatus("Error deleting account. You may need to re-authenticate.")
            }
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            console.log("User signed out")
            router.push('/')
        } catch (error) {
            console.log("Error signing out:", error)
        }
    }

    if (loading) return <p>Loading...</p>
    if (!user) return <p>Please log in to view your account.</p>

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Account Details</h1>

            <div className={styles.detailContainer}>
                <div className={styles.flex}>
                    <FaUser className={styles.marginR}/>
                    <p className={styles.userInfo}><strong>Username:</strong></p>
                    {showUsernameInput 
                        ? <input type="text" className={styles.input} value={username} placeholder={username} onChange={(e) => setUsername(e.target.value)}/>
                        : <p>{username}</p>
                    }
                </div>
                {!showUsernameInput 
                    ? <button className={styles.changeBtn} onClick={handleToggleUsernameInput}><small>Change username</small></button>
                    : <div className={styles.changeCancelContainer}>
                        <button className={`${styles.changeBtn} ${styles.confirmBtn}`} onClick={handleUsernameChange}><small>Confirm</small></button>
                        <button className={styles.changeBtn} onClick={() => {setUsername(originalUsername); setShowUsernameInput(false)}}><small>Cancel</small></button>
                    </div>
                }
            </div>

            <div className={styles.detailContainer}>
                <div className={styles.flex}>
                    <IoMdMail className={styles.marginR}/>
                    <p className={styles.userInfo}><strong>Email:</strong></p>
                    {showEmailInput 
                        ? <input type="text" className={styles.input} value={email} placeholder={user.email} onChange={(e) => setEmail(e.target.value)}/> 
                        : <p>{user.email}</p>
                    }
                </div>
                {!showEmailInput 
                    ? <button className={styles.changeBtn} onClick={handleToggleEmailInput}><small>Change email address</small></button>
                    : <div className={styles.changeCancelContainer}>
                        <button className={`${styles.changeBtn} ${styles.confirmBtn}`} onClick={handleEmailChange}><small>Confirm</small></button>
                        <button className={styles.changeBtn} onClick={() => setShowEmailInput(false)}><small>Cancel</small></button>
                    </div>
                }
            </div>

            <div className={styles.detailContainer}>
                <div className={styles.flex}>
                    <MdVerifiedUser className={styles.marginR}/>
                    <p>
                        <strong>Email status:</strong>{" "}
                        {user.emailVerified ? (
                            <> Verified <span className={`${styles.vAlign} ${styles.verified}`}><MdVerified className={styles.vAlign}/></span> </>
                        ) : (
                            <> Not verified <span className={`${styles.vAlign} ${styles.warning}`}><MdWarning /></span> </>
                        )}
                    </p>
                </div>
                {!user.emailVerified && <button className={styles.changeBtn} onClick={sendEmailVerificationToUser}><small>Send Verification</small></button>}
            </div>

            <div className={styles.flex}>
                <FaCalendarAlt className={styles.marginR}/>
                <p><strong>Account Created:</strong> {createdAt}</p>
            </div>
            
            <button className={styles.signOutBtn} onClick={handleSignOut}>Sign Out</button>
            <hr/>
            <button className={styles.deleteAccBtn} onClick={handleDeleteAccount}>Delete Account</button>

            {status && <p>{status}</p>}
        </div>
    )
}