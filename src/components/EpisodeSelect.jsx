import { useState } from 'react'
export default function EpisodeSelect({ seasons }) {
  console.log(seasons[1], "Logging seasons object")

  const tvShow = seasons.map((season) => ({
    id: season.id,
    seasonName: season.name,
    seasonNo: season.season_number, 
    episodes: Array.from({ length: season.episode_count }, (_, i) => i +1 ),
  }))
  console.log(tvShow, "Episodes Per Season")

  const [episodesList, setEpisodesList] = useState(tvShow[0].episodes)
  
  const changeEpisodesSelect = (e) => {
    const selectedSeasonNo = Number(e.target.value);
    const selectedSeason = tvShow.find(s => s.seasonNo === selectedSeasonNo)
    if (selectedSeason) {
      setEpisodesList(selectedSeason.episodes)
    }
  }

  console.log(episodesList, 'Episodeslist State')
  return (
    <div>
      <label className="input-label">
        Season:
        <select className="input-select"onChange={changeEpisodesSelect}>
          {tvShow.map((show) => (
            <option key={show.id} value={show.seasonNo}>{show.seasonName}</option>
          ))}
        </select>
      </label>
      <label className="input-label">
        Episode:
        <select className="input-select">
          {episodesList.length === 0 || episodesList === null ? (
            <option value="n/a">N/A</option>
          ) : (
            episodesList.map((ep, i) => (
              <option key={i} value={ep}>Episode {ep}</option>
            ))
          )}
        </select>
      </label>
    </div>
  )
}