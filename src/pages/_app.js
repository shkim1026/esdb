import '../styles/globals.css';
import '../styles/App.css';
import '../components/Header/Header.module.css';  //Prevents FOUC
import Header from '../components/Header/Header'; //Prevents FOUC
import Footer from '../components/Footer/Footer'
import Head from 'next/head';
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { useState, useEffect, useCallback } from 'react'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()

export default function App({ Component, pageProps }) {
  const [favorites, setFavorites] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe();
  }, [])

  // Fetch favorites from firestore
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      console.error("User not logged in")
      setFavorites([])
      return [];
    }

    try {
      const favoritesRef = collection(db, "users", user.uid, "favorites")
      const snapshot = await getDocs(favoritesRef)

      const fetchedFavorites = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log("Favorites fetched from Firestore:", fetchedFavorites)
      setFavorites(fetchedFavorites)
      return fetchedFavorites

    } catch (error) {
      console.log("Error fetching favorites:", error)
      return []
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user, fetchFavorites])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="app-container">
        <Header refreshFavorites={fetchFavorites} user={user}/>
        <main className="main-content">
          <Component {...pageProps} user={user} refreshFavorites={fetchFavorites} favorites={favorites}/>
        </main>
        <Footer />
      </div>
    </>
  );
}