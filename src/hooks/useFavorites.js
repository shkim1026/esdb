
import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase/firebase'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'

export default function useFavorites(itemId) {
  const [isFavorite, setIsFavorite] = useState(false)

//   Set item to isFavorite state
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = auth.currentUser
        if (!user) return setIsFavorite(false)

        const favRef = doc(db, "users", user.uid, "favorites", itemId.toString())
        const favSnap = await getDoc(favRef)
        setIsFavorite(favSnap.exists())
      } catch (err) {
        console.error("Error checking favorite status:", err)
      }
    }

    if (itemId) checkStatus()
  }, [itemId])

//   Add To Favorites
  const addToFavorites = async (item, mediaType) => {
    const user = auth.currentUser
    if (!user) {
      alert("Please sign in to add items to your list.")
      return
    }

    const favRef = doc(db, "users", user.uid, "favorites", item.id.toString())

    try {
      await setDoc(favRef, {
        ...item,
        mediaType,
        addedAt: new Date().toISOString()
      })
      setIsFavorite(true)
    } catch (err) {
      console.error("Error adding to favorites:", err)
    }
  }

//   Remove from Favorites
  const removeFromFavorites = async () => {
    const user = auth.currentUser
    if (!user) {
      alert("You must be signed in to remove favorites.")
      return
    }

    const favRef = doc(db, "users", user.uid, "favorites", itemId.toString())

    try {
      await deleteDoc(favRef)
      setIsFavorite(false)
    } catch (err) {
      console.error("Error removing from favorites:", err)
    }
  }

  return { isFavorite, addToFavorites, removeFromFavorites }
}
