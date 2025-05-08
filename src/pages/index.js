import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Categories from '../components/Categories/Categories';
import SkeletonCategories from '../components/SkeletonCategories/SkeletonCategories';

export default function Home({ refreshFavorites, user, favorites }) {
  const apiKeyReadAccess = process.env.NEXT_PUBLIC_API_KEY_READ_ACCESS;

  const [data, setData] = useState({
    movies: [],
    topMovies: [],
    tv: [],
    topTv: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const options = useMemo(() => ({
    method: &apos;GET&apos;,
    headers: {
      accept: &apos;application/json&apos;,
      Authorization: `Bearer ${apiKeyReadAccess}`
    }
  }), [apiKeyReadAccess]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          &apos;https://api.themoviedb.org/3/trending/movie/day?language=en-US&apos;,
          &apos;https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&apos;,
          &apos;https://api.themoviedb.org/3/trending/tv/day?language=en-US&apos;,
          &apos;https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&apos;
        ];
        const [movieRes, topMovieRes, tvRes, topTvRes] = await Promise.all(
          urls.map(url => fetch(url, options).then(res => res.json()))
        );

        setData({
          movies: movieRes.results,
          topMovies: topMovieRes.results,
          tv: tvRes.results,
          topTv: topTvRes.results,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [options]);

  return (
    <>
      <Head>
        <title>Entertainment Streaming Database (ESDB)</title>
        <meta 
          name="description" 
          content="Stream your favorite movies and TV shows instantly. Browse trending titles, top rated, and build your personal watchlist." 
        />
      </Head>
      {isLoading 
        ? <SkeletonCategories /> 
        : <Categories data={data} refreshFavorites={refreshFavorites} user={user} favorites={favorites}/>
      }
    </>
  );
}
