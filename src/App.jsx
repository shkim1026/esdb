import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'
import Categories from './components/Categories'

function App() {
  //const apiKey = import.meta.env.VITE_API_KEY;
  const apiKeyReadAccess = import.meta.env.VITE_API_KEY_READ_ACCESS;
  const [data, setData] = useState({
    movies:[],
    topMovies:[],
    tv: [],
    topTv: [],
  })

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKeyReadAccess}`
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
          'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
          'https://api.themoviedb.org/3/trending/tv/day?language=en-US',
          'https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1'
        ]
        const [movieRes, topMovieRes, tvRes, topTvRes] = await Promise.all(
          urls.map(url => fetch(url, options).then(res => res.json()))
        )

        setData({
          movies: movieRes.results,
          topMovies: topMovieRes.results,
          tv: tvRes.results,
          topTv: topTvRes.results,
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, []);

  return (
    <>
      <Categories data={data}/>
    </>
  )
}

export default App
