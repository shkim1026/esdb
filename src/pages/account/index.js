import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { 
    getAuth, 
    onAuthStateChanged, 
    deleteUser, 
    signOut, 
    sendEmailVerification
} from 'firebase/auth'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../../../firebase/firebase'
import styles from './index.module.css'
import Head from 'next/head'

import { FaUser, FaCalendarAlt } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { MdVerifiedUser, MdVerified, MdWarning } from 'react-icons/md'

export default function Account() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [originalUsername, setOriginalUsername] = useState('')
    const [showUsernameInput, setShowUsernameInput] = useState(false)
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

                const docRef = doc(db, &quot;users&quot;, firebaseUser.uid);
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setUsername(docSnap.data().username || &quot;&quot;)
                    setOriginalUsername(docSnap.data().username || &quot;&quot;)
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
                alert(&quot;Verification email sent! Please check your inbox and verify your email.&quot;)
            } catch (error) {
                console.log(&quot;Error sending verification email:&quot;, error)
                alert(&quot;Failed to send verification email: &quot; + error.message)
            }
        } else {
            alert(&quot;Your email is already verified&quot;)
        }
    }

    const handleToggleUsernameInput = () => {
        setUsername(username)
        setShowUsernameInput(true)
    }

    const handleUsernameChange = async () => {
        if (!username) return;
        try {
            const docRef = doc(db, &quot;users&quot;, user.uid)
            await updateDoc(docRef, { username })
            setStatus(&quot;Username updated sucessfully.&quot;)
            setShowUsernameInput(false)
        } catch (error) {
            console.log(error)
            setStatus(&quot;Error updating username.&quot;)
        }
    }

    const handleDeleteAccount = async () => {
        const auth = getAuth()
        const currentUser = auth.currentUser

        if (confirm(&quot;Are you sure you want to delete your account? This cannot be undone.&quot;)) {
            try {
                await deleteDoc(doc(db, &quot;users&quot;, currentUser.uid))
                await deleteUser(currentUser)
                setStatus(&quot;Account deleted.&quot;)
            } catch (error) {
                console.log(error)
                setStatus(&quot;Error deleting account. You may need to re-authenticate.&quot;)
            }
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            console.log(&quot;User signed out&quot;)
            router.push(&apos;/&apos;)
        } catch (error) {
            console.log(&quot;Error signing out:&quot;, error)
        }
    }

    if (loading) return <p>Loading...</p>
    if (!user) return <p className={styles.notLoggedIn}>Please log in to view your account.</p>

    return (
        <>
        <Head>
            <title>My Account</title>
            <meta name="description" content="View or change my account details"/>
        </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>Account Details</h1>

                {/* Username Section */}
                <section aria-labelledby="username-section">
                    <h2 id="username-section" className={styles.SROnly}>Username Section</h2>
                    <div className={styles.detailContainer}>
                        <div className={styles.flex}>
                            <FaUser className={styles.marginR}/>
                            <p className={styles.userInfo}><strong>Username:</strong></p>
                            {showUsernameInput 
                                ? <input 
                                    type="text" 
                                    className={styles.input} 
                                    value={username} 
                                    placeholder={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    aria-label=&quot;Edit Username&quot; 
                                />
                                : <p className={styles.username}>{username}</p>
                            }
                        </div>
                        {!showUsernameInput 
                            ? <button 
                                className={styles.changeBtn} 
                                onClick={handleToggleUsernameInput} 
                                aria-label="Change username">
                                <small>Change username</small>
                            </button>
                            : <div className={styles.changeCancelContainer}>
                                <button 
                                    className={`${styles.changeBtn} ${styles.confirmBtn}`} 
                                    onClick={handleUsernameChange} 
                                    aria-label="Confirm username change">
                                    <small>Confirm</small>
                                </button>
                                <button 
                                    className={styles.changeBtn} 
                                    onClick={() => {setUsername(originalUsername); setShowUsernameInput(false)}} 
                                    aria-label=&quot;Cancel username change&quot;>
                                    <small>Cancel</small>
                                </button>
                            </div>
                        }
                    </div>
                </section>

                {/* Email Section */}
                <section aria-labelledby="email-section">
                    <h2 id="email-section" className={styles.SROnly}>Email Section</h2>
                    <div className={styles.detailContainer}>
                        <div className={styles.flex}>
                            <IoMdMail className={styles.marginR}/>
                            <p className={styles.userInfo}><strong>Email:</strong></p>
                            <p className={styles.email}>{user.email}</p>
                        </div>
                    </div>
                </section>

                {/* Email Status Section */}
                <section aria-labelledby="email-status-section">
                    <h2 id="email-status-section" className={styles.SROnly}>Email Status Section</h2>
                    <div className={styles.detailContainer}>
                        <div className={styles.flex}>
                            <MdVerifiedUser className={styles.marginR}/>
                            <p>
                                <strong>Email status:</strong>{&quot; &quot;}
                                {user.emailVerified ? (
                                    <> Verified <span className={`${styles.vAlign} ${styles.verified}`}><MdVerified className={styles.vAlign}/></span> </>
                                ) : (
                                    <> Not verified <span className={`${styles.vAlign} ${styles.warning}`}><MdWarning /></span> </>
                                )}
                            </p>
                        </div>
                        {!user.emailVerified && <button 
                            className={styles.changeBtn} 
                            onClick={sendEmailVerificationToUser} 
                            aria-label="Send email verification">
                            <small>Send Verification</small>
                        </button>}
                    </div>
                </section>

                {/* Account Created Date */}
                <section>
                    <div className={styles.flex}>
                        <FaCalendarAlt className={styles.marginR}/>
                        <p><strong>Created:</strong> {createdAt}</p>
                    </div>
                </section>

                {/* Sign Out & Delete Account Buttons */}
                <section>
                    <button className={styles.signOutBtn} onClick={handleSignOut} aria-label="Sign out of account">Sign Out</button>
                    <hr/>
                    <button className={styles.deleteAccBtn} onClick={handleDeleteAccount} aria-label="Delete account">Delete Account</button>
                </section>

                {/* Status Updates */}
                {status && <p>{status}</p>}
            </div>
        </>
    )
}
