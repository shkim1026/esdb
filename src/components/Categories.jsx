import React from 'react'
import Card from './Card'

export default function Categories({data}) {
    console.log(data.tv, "tv")
    console.log(data.movies, "movie")
    const categories = [
        {title: "Trending Movies", key: "movies"},
        {title: "Trending TV Series", key: "tv"},
        {title: "Top Rated Movies", key: "topMovies"},
        {title: "Top Rated TV Series", key: "topTv"},
    ]
    return (
        <>
            {categories.map(({title, key}) => (
                <section className="categories--section" key={key}>
                    <h2>{title}</h2>
                    <div className="categories--cards-container">
                        {data[key].map(item => (
                            <Card key={item.id} data={item} />
                        ))}
                    </div>
                </section>
            ))}
        </>
    )
}