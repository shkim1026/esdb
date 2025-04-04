import Card from './Card'

export default function Categories({data}) {
  console.log(data.tv, "tv")
  console.log(data.movies, "movie")
  console.log(data.topMovies, "top movies")
  console.log(data.topTv, "top tv")
  const categories = [
    {title: "Trending Movies", key: "movies", mediaType: "movie"},
    {title: "Trending TV Series", key: "tv", mediaType: "tv"},
    {title: "Top Rated Movies", key: "topMovies", mediaType: "movie"},
    {title: "Top Rated TV Series", key: "topTv", mediaType: "tv"},
  ]
  return (
    <>
      {categories.map(({title, key, mediaType}) => (
        <section className="categories--section" key={key}>
          <h2 className="categories--title">{title}</h2>
          <div className="categories--cards-container">
            {data[key].map(item => (
              <Card 
                key={item.id} 
                data={item} 
                mediaType={mediaType}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}