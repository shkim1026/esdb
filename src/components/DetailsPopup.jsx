import React from 'react'
//Reminder: Remove React Icons from dependencies if not used!

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

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div 
          className="popup-content" 
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
        <button className="close-btn" onClick={onClose}>×</button>
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
                  <p><strong>Overview:</strong> {item.overview}</p>
                  <p>Rating: 
                    <span className={`rating ${rating > 7 ? 'high' : rating >= 4 ? 'medium' : 'low'}`}>{rating}/10</span>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
})

export default DetailsPopup;