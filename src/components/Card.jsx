import { useState } from 'react'
import DetailsPopup from './DetailsPopup'

export default function Card({data}) {
    const [selectedItem, setSelectedItem] = useState(null)
    
    const openPopup = (item) => {
        setSelectedItem(item)
    }
    const closePopup = () => {
        setSelectedItem(null)
    }

    return (
        <>  
            <img 
                className="card--image" 
                src={`https://image.tmdb.org/t/p/original/${data.poster_path}`} 
                alt={data.title}
                onClick={() => openPopup(data)}
            />
            {selectedItem && <DetailsPopup item={selectedItem} onClose={closePopup} />}
        </>
    )
}