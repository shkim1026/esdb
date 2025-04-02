import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card'

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiKeyReadAccess = import.meta.env.VITE_API_KEY_READ_ACCESS;
  const [movies, setMovies] = useState([]);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKeyReadAccess}`
    }
  };
  
  // fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
  //   .then(res => res.json())
  //   .then(res => console.log(res))
  //  .catch(err => console.error(err));
  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    .then(res => res.json())
    .then(data => setMovies(data.results))
    .catch(err => console.error(err));
  }, [])

  const renderMovies = () => {
    return movies.map((movie) => <Card key={movie.id} movie={movie} />)
  }

  return (
    <>
      <div>
        <h1>Now Playing</h1>
        {renderMovies()}
      </div>
    </>
  )
}

export default App
