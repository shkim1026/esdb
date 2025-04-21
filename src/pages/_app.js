import '../styles/globals.css';
import '../styles/App.css';
import '../components/Header/Header.module.css';  //Prevents FOUC
import Header from '../components/Header/Header'; //Prevents FOUC
import Head from 'next/head';
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { useState, useEffect } from 'react'

const auth = getAuth()

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe();
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <Component {...pageProps} user={user} />
    </>
  );
}