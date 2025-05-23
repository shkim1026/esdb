import Card from '../Card/Card'
import DetailsPopup from '../DetailsPopup/DetailsPopup'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import styles from './Categories.module.css'

import { useState, useCallback } from 'react'

import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebase/firebase'

import { BsCheckCircle, BsPlusCircle } from 'react-icons/bs'

export default function Categories({data, refreshFavorites, user, favorites}) {
  console.log(data.tv, "tv")
  console.log(data.movies, "movie")
  console.log(data.topMovies, "top movies")
  console.log(data.topTv, "top tv")
  const categories = [
    {title: "Trending Movies", key: "movies", mediaType: "movie"},
    {title: "Trending TV Series", key: "tv", mediaType: "tv"},
    {title: "Top Rated Movies", key: "topMovies", mediaType: "movie"},
    {title: "Top Rated TV Series", key: "topTv", mediaType: "tv"},
  ]

  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const apiKeyReadAccess = process.env.NEXT_PUBLIC_API_KEY_READ_ACCESS;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKeyReadAccess}`
    }
  }

  // Fetches movie/TV show details
  const fetchDetails = useCallback(async (id, mediaType) => {
    console.log(`Fetching details for ${mediaType} with ID: ${id}`);
    if (loading) return;
    setLoading(true)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`, options)
      const data = await res.json()
      console.log("Fetched details:", data);
      setSelectedItem({...data, mediaType});
    } catch (error) {
      console.log("Error fetching details:", error)
    } finally {
      setLoading(false)
    }
  },[loading])

  // Closes Popup Modal
  const closePopup = () => {
    setSelectedItem(null)
  }

  // Adds or removes item from favorites
  const toggleFavorites = async (item, mediaType) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please sign in to modify your list.")
      return
    }

    const isFavorited = favorites?.some(fav => fav.id === item.id)
    const favRef = doc(db, "users", currentUser.uid, "favorites", item.id.toString())

    try {
      if (isFavorited) {
        await deleteDoc(favRef);
        console.log("Removed from favorites")
      } else {
        await setDoc(favRef, {
          ...item,
          mediaType,
          addedAt: new Date().toISOString()
        })
        console.log("Added to favorites")
      }
      refreshFavorites();
    } catch (error) {
      console.log("Error toggling favorite:", error)
      alert("Error updating favorites: " + error.message)
    }
  }


  return (
    <div className={styles['categories']}>
      {user && favorites.length > 0 &&
        <section className={styles['categories--section']}>
          <h2 className={styles['categories--title']}>My List</h2>
          <Splide 
            aria-label='My list'
            options={{
              mediaQuery: 'min',
              gap: '1rem',
              type: 'loop',
              arrows: false,
              pagination: false,
              autoWidth: true,
              autoHeight: true,
              keyboard: 'focused',
              breakpoints: {
                1024: {
                  arrows: true,
                  type: 'slide',
                },
              },
            }}
          >
            {[...favorites]
              .sort((a, b) => {
                const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(a.addedAt);
                const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(b.addedAt);
                return dateB - dateA; // descending: newest first
              })
              .map(item => (
                <SplideSlide key={item.id}>
                  <div className={styles.iconWrapper}>
                    <BsCheckCircle className={styles.addToListIcon} onClick={(e) => {e.stopPropagation(); toggleFavorites(item, item.mediaType)}}/>
                    <span className={styles.tooltip}>Remove from My List</span>
                  </div>
                  <Card 
                    data={item}
                    mediaType={item.mediaType}
                    fetchDetails={(e) => {
                      e.stopPropagation(); 
                      fetchDetails(item.id, item.mediaType, e)
                    }}
                  />
                </SplideSlide>
              ))
            }
          </Splide>
        </section>
      }


      {categories.map(({title, key, mediaType}) => (
        <section className={styles['categories--section']} key={key}>
          <h2 className={styles['categories--title']}>{title}</h2>
          <Splide 
            aria-label={title}
            options={{
              mediaQuery: 'min',
              gap: '1rem',
              type: 'loop',
              arrows: false,
              pagination: false,
              autoWidth: true,
              autoHeight: true,
              keyboard: 'focused',
              breakpoints: {
                1024: {
                  arrows: true,
                  type: 'slide',
                },
              },
            }}
          >
            {data[key].map(item => {
              const isFavorited = favorites?.some(fav => fav.id === item.id)

              return (
              <SplideSlide key={item.id}>
                {isFavorited
                    ? (
                      <div className={styles.iconWrapper}>
                        <BsCheckCircle className={styles.addToListIcon} onClick={(e) => {e.stopPropagation(); toggleFavorites(item, mediaType)}}/>
                        <span className={styles.tooltip}>Remove from My List</span>
                      </div>
                      )
                    : (
                      <div className={styles.iconWrapper}>
                        <BsPlusCircle className={styles.addToListIcon} onClick={(e) => {e.stopPropagation(); toggleFavorites(item, mediaType)}}/>
                        <span className={styles.tooltip}>Add to My List</span>
                      </div>
                      )
                }
                <Card 
                  data={item} 
                  mediaType={mediaType}
                  fetchDetails={(e) => {
                    e.stopPropagation(); 
                    fetchDetails(item.id, mediaType, e)
                  }}
                  user={user}
                />
              </SplideSlide>
              )
            })}
          </Splide>
        </section>
      ))}

      {loading && <LoadingSpinner />}

      {selectedItem && (
        <DetailsPopup 
          item={selectedItem} 
          onClose={closePopup} 
          mediaType={selectedItem.mediaType} 
          refreshFavorites={refreshFavorites}
        />
      )}
    </div>
  )
}