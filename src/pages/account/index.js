import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, updateProfile, deleteUser } from 'firebase/auth'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import styles from './index.module.css'

import { FaUser, FaCalendarAlt } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'

export default function Account() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')

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
                }
                setLoading(false)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    const handleUsernameChange = async () => {
        if (!username) return;
        try {
            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, { username })
            setStatus("Usename updated sucessfully.")
        } catch (error) {
            console.log(error)
            setStatus("Error updating username.")
        }
    }

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

    if (loading) return <p>Loading...</p>
    if (!user) return <p>Please log in to view your account.</p>

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Account Details</h1>

            <div className={styles.detailContainer}>
                <div className={styles.flex}>
                    <FaUser className={styles.marginR}/>
                    <p className={styles.userInfo}><strong>Username:</strong> {username}</p>
                </div>
                <button className={styles.changeBtn}><small>Change username</small></button>
            </div>

            <div className={styles.detailContainer}>
                <div className={styles.flex}>
                    <IoMdMail className={styles.marginR}/>
                    <p className={styles.userInfo}><strong>Email:</strong> {user.email}</p>
                </div>
                <button className={styles.changeBtn} onClick={handleUsernameChange}><small>Change email address</small></button>
            </div>

            <div className={styles.flex}>
                <FaCalendarAlt className={styles.marginR}/>
                <p><strong>Account Created:</strong> {createdAt}</p>
            </div>
            
            <button className={styles.signOutBtn}>Sign Out</button>
            <hr/>
            <button onClick={handleDeleteAccount} className={styles.deleteAccBtn}>Delete Account</button>

            {status && <p>{status}</p>}
        </div>
    )
}