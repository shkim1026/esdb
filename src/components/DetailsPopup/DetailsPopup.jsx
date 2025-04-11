import React from 'react'
import { IoClose } from 'react-icons/io5'
import EpisodeSelect from '../EpisodeSelect/EpisodeSelect'
import EmbedVideoModal from '../EmbedVideoModal/EmbedVideoModal'
import './DetailsPopup.css'

const DetailsPopup = React.memo(function DetailsPopup({ item, onClose, mediaType }) {
  console.log("Selected Item in DetailsPopup", item)
  console.log("Selected Item in", mediaType)

  const genres = item.genres.map(genre => genre.name).join(", ")

  const releaseDate = mediaType === 'movie'
                      ? item.release_date
                      : item.first_air_date

  const date = mediaType === 'movie' ? item.release_date : item.first_air_date
  const year = date.split("-")[0]

  function convertRuntimeToHours(min) {
    const hours = Math.floor(min / 60)
    const minutes = min % 60
    return `${hours}h ${minutes}m`
  }

  const rating = Math.floor(item.vote_average * 10) / 10

  const movieUrl = `https://vidsrc.xyz/embed/movie/${item.id}/`

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div 
          className="popup-content fade-in" 
          onClick={(e) => e.stopPropagation()}   
          style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "300px center",
              backgroundRepeat: "no-repeat",
              color: "white",
              padding: "20px",
              borderRadius: "8px"
          }}
      >
        <button className="close-btn" onClick={onClose} aria-label="Close"><IoClose /></button>
          <div className="popup-content--flex">
            <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={item.title} />
            <div>
                <h2 className="popup-content--title">{item.title ? item.title : item.name} <span>({year})</span></h2>
                {(item.original_name && item.original_name !== item.name && (
                  <p className="popup-content--original-title">{item.original_name}</p>
                )) ||
                  (item.original_title && item.original_title !== item.title && (
                    <p className="popup-content--original-title">{item.original_title}</p>
                  ))}
                <div className="popup-content--facts">
                  <span className="popup-content--facts--release-date">{releaseDate} &#x2022; </span>
                  <span className="popup-content--facts--genres">{genres}</span>
                  {item.runtime !== 0 && item.runtime && (
                    <span> &#x2022; {convertRuntimeToHours(item.runtime)}</span>
                  )}
                </div>
                {item.tagline !== "" && <p className="popup-content--tagline">"{item.tagline}"</p>}
                <p><strong>Overview:</strong><br/>{item.overview}</p>
                <p>Rating: 
                  <span className={`rating ${rating > 7 ? 'high' : rating >= 4 ? 'medium' : rating < 4 && rating !== 0 ? 'low' : ''}`}>
                    {rating !== 0 ? `${rating}/10` : "N/A"}
                  </span>
                </p>
                {mediaType === 'tv' && 
                  <EpisodeSelect 
                    seasons={item.seasons}
                    showId={item.id}
                    title={item.name}
                  />
                }
                {mediaType === 'movie' && 
                  <EmbedVideoModal url={movieUrl} title={item.name}/>
                }
            </div>
          </div>
      </div>
    </div>
  );
})

export default DetailsPopup;