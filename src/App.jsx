import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import './App.css'
import Categories from './components/Categories/Categories'
import Header from './components/Header/Header'

function App() {
  //const apiKey = import.meta.env.VITE_API_KEY;
  const apiKeyReadAccess = import.meta.env.VITE_API_KEY_READ_ACCESS;
  const [data, setData] = useState({
    movies:[],
    topMovies:[],
    tv: [],
    topTv: [],
  })

  const options = useMemo(() => ({
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKeyReadAccess}`
    }
  }), [apiKeyReadAccess])
  
  //Initial fetch to display Categories.jsx on landing page
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
        console.log("Fetched Movies:", movieRes.results);
        console.log("Fetched TV Shows:", tvRes.results);
        console.log("Fetched Top Movies:", topMovieRes.results);
        console.log("Fetched Top TV Shows:", topTvRes.results);
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
      <Header />
      <Categories 
        data={data} 
      />
    </>
  )
}

export default App
