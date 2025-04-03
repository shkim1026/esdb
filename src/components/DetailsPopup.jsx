export default function MoviePopup({ item, onClose }) {
    const originalName = item.original_name && item.original_name !== item.name ? item.original_name : null;
    const releaseDate = item.release_date ? <p>Release Date: {item.release_date}</p> : <p>First Air Date: {item.first_air_date}</p>

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
                color: "white", // Ensure text is visible
                padding: "20px",
                borderRadius: "8px"
            }}
        >
          <button className="close-btn" onClick={onClose}>×</button>
            <div className="popup-content--flex">
                <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={item.title} />
                <div>
                    <h2>{item.title ? item.title : item.name}</h2>
                    {originalName && <h3>{originalName}</h3>}
                    {releaseDate}
                    <p><strong>Overview:</strong> {item.overview}</p>
                    <p><strong>Rating:</strong> ⭐ {item.vote_average}</p>
                </div>
            </div>
        </div>
      </div>
    );
  }