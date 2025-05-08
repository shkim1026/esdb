import React from 'react'
import EpisodeSelect from '../EpisodeSelect/EpisodeSelect'
import EmbedVideoModal from '../EmbedVideoModal/EmbedVideoModal'
import styles from './DetailsPopup.module.css'
import useFavorites from '../../hooks/useFavorites'

import { IoClose } from 'react-icons/io5'
import { BsCheckCircle, BsPlusCircle } from 'react-icons/bs'

const DetailsPopup = React.memo(function DetailsPopup({ item, onClose, mediaType, refreshFavorites }) {

  console.log("Selected Item in DetailsPopup", item)
  console.log("Selected Item in", mediaType)

  const genres = item.genres.map(genre => genre.name).join(&quot;, &quot;)

  const releaseDate = mediaType === &apos;movie&apos;
                      ? item.release_date
                      : item.first_air_date

  const date = mediaType === &apos;movie&apos; ? item.release_date : item.first_air_date
  const year = date.split(&quot;-&quot;)[0]

  function convertRuntimeToHours(min) {
    const hours = Math.floor(min / 60)
    const minutes = min % 60
    return `${hours}h ${minutes}m`
  }

  const rating = Math.floor(item.vote_average * 10) / 10

  const movieUrl = `https://vidsrc.xyz/embed/movie/${item.id}/`

  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites(item.id)

  return (
    <div
      className={styles["popup-overlay"]}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        className={`${styles["popup-content"]} ${styles["fade-in"]}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/w1280/${item.backdrop_path})`,
          backgroundSize: &quot;cover&quot;,
          backgroundPosition: &quot;300px center&quot;,
          backgroundRepeat: &quot;no-repeat&quot;,
          color: &quot;white&quot;,
          padding: &quot;20px&quot;,
          borderRadius: &quot;8px&quot;
        }}
      >
        <button
          className={styles["close-btn"]}
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose />
        </button>
  
        <div className={styles["popup-content--flex"]}>
          <img
            className={styles["popup-content--img"]}
            src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
            alt={item.title ? item.title : item.name}
          />
  
          <div>
            <h2
              id="popup-title"
              className={styles["popup-content--title"]}
            >
              {item.title ? item.title : item.name} <span>({year})</span>
            </h2>
  
            {(item.original_name && item.original_name !== item.name && (
              <p className={styles["popup-content--original-title"]}>
                {item.original_name}
              </p>
            )) ||
              (item.original_title && item.original_title !== item.title && (
                <p className={styles["popup-content--original-title"]}>
                  {item.original_title}
                </p>
              ))}
  
            <div className={styles["popup-content--facts"]}>
              <span className={styles["popup-content--facts--release-date"]}>
                {releaseDate} &#x2022;{&quot; &quot;}
              </span>
              <span className={styles["popup-content--facts--genres"]}>
                {genres}
              </span>
              {item.runtime !== 0 && item.runtime && (
                <span> &#x2022; {convertRuntimeToHours(item.runtime)}</span>
              )}
            </div>
  
            {item.tagline !== &quot;&quot; && (
              <p className={styles["popup-content--tagline"]}>
                &quot;{item.tagline}&quot;
              </p>
            )}
  
            <p>
              <strong>Overview:</strong>
              <br />
              {item.overview}
            </p>
  
            <p>
              Rating:{&quot; &quot;}
              <span
                className={`${styles.rating} ${
                  rating >= 8
                    ? styles.high
                    : rating >= 4
                    ? styles.medium
                    : rating < 4 && rating !== 0
                    ? styles.low
                    : ""
                }`}
              >
                {rating !== 0 ? `${rating}/10` : &quot;N/A&quot;}
              </span>
            </p>
  
            <button
              className={styles["myList--btn"]}
              onClick={() => {
                if (isFavorite) {
                  removeFromFavorites();
                  refreshFavorites();
                } else {
                  addToFavorites(item, mediaType);
                  refreshFavorites();
                }
              }}
              aria-label={isFavorite ? &quot;Remove from My List&quot; : &quot;Add to My List&quot;}
            >
              {isFavorite ? (
                <BsCheckCircle className={styles["myList--icon"]} />
              ) : (
                <BsPlusCircle className={styles["myList--icon"]} />
              )}
              <p className={styles["myList--text"]}>
                {isFavorite ? &quot;On My List&quot; : &quot;Add to My List&quot;}
              </p>
            </button>
  
            {mediaType === &quot;tv&quot; && (
              <EpisodeSelect
                seasons={item.seasons}
                showId={item.id}
                title={item.name}
              />
            )}
            {mediaType === &quot;movie&quot; && (
              <EmbedVideoModal url={movieUrl} title={item.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );  
})

export default DetailsPopup;