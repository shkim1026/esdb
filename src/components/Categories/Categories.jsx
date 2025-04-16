import Card from '../Card/Card'
import DetailsPopup from '../DetailsPopup/DetailsPopup'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useState, useCallback } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import styles from './Categories.module.css'

export default function Categories({data}) {
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
  },[])

  const closePopup = () => {
    setSelectedItem(null)
  }

  const handleClick = useCallback((id, mediaType, e) => {
    e.stopPropagation();
    console.log("Card is clicked");
    fetchDetails(id, mediaType)
  }, [fetchDetails]);


  return (
    <main className={styles['categories']}>
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
              breakpoints: {
                1024: {
                  arrows: true,
                  type: 'slide',
                },
              },
            }}
          >
            {data[key].map(item => (
              <SplideSlide key={item.id}>
                <Card 
                  key={item.id} 
                  data={item} 
                  mediaType={mediaType}
                  handleClick={(e) => handleClick(item.id, mediaType, e)}
                />
              </SplideSlide>
            ))}
          </Splide>
        </section>
      ))}
      {loading && <LoadingSpinner />}
      {selectedItem && <DetailsPopup item={selectedItem} onClose={closePopup} mediaType={selectedItem.mediaType}/>}
    </main>
  )
}