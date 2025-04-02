import React from 'react'

export default function Card({data}) {
    return (
        <>  
            <a href="#">
                <img className="card--image" src={`https://image.tmdb.org/t/p/original/${data.poster_path}`}/>
            </a>
        </>
    )
}