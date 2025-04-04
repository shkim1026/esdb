
import { useCallback, useState } from 'react';
import DetailsPopup from './DetailsPopup';

export default function Card({ data, mediaType }) {

  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const apiKeyReadAccess = import.meta.env.VITE_API_KEY_READ_ACCESS;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKeyReadAccess}`
    }
  }
  
  const fetchDetails = useCallback(async (id, type) => {
    console.log(`Fetching details for ${type} with ID: ${id}`);
    if (loading) return;
    setLoading(true)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options)
      const data = await res.json()
      console.log("Fetched details:", data);
      setSelectedItem(data);
    } catch (error) {
      console.log("Error fetching details:", error)
    } finally {
      setLoading(false)
    }
  },[])

  const closePopup = () => {
    setSelectedItem(null)
  }

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    console.log("Card is clicked");
    fetchDetails(data.id, mediaType)
  }, [data.id, mediaType]);

  return (
    <>  
      <img 
        className="card--image" 
        src={`https://image.tmdb.org/t/p/original/${data.poster_path}`} 
        alt={data.title}
        onClick={handleClick}
      />
      {selectedItem && <DetailsPopup item={selectedItem} onClose={closePopup} mediaType={mediaType}/>}
    </>
  );
}