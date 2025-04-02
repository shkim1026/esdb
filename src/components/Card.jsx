import React from 'react'

export default function Card(props) {
    console.log(props)
    return (
        <>
            <a href="#">
                <img src={`https://image.tmdb.org/t/p/w200${props.movie.poster_path}`} alt={props.movie.title}/>
            </a>
        </>
    )
}