import { useState } from 'react'
import EmbedVideoModal from '../EmbedVideoModal/EmbedVideoModal'
import styles from './EpisodeSelect.module.css'

export default function EpisodeSelect({ seasons, showId, title }) {

  const tvShow = seasons.map((season) => ({
    id: season.id,
    seasonNo: season.season_number, 
    episodes: Array.from({ length: season.episode_count }, (_, i) => i +1 ),
  }))
  console.log(seasons, 'Seasons prop returns an array of seasons')
  console.log(tvShow, "Array of Seasons w/ array of Episodes")

  //Sets initial episodes select options
  const [episodesList, setEpisodesList] = useState(() => {
    const validSeason = tvShow.find(show => show.seasonNo !== 0)
    return validSeason ? validSeason.episodes : [];
  })

  // Parameters for API call to VidSrc
  const [selection, setSelection] = useState({
    id: showId,
    season: 1,
    episode: 1,
  })
  
  const handleSeasonChange = (e) => {
    const selectedSeasonNo = parseInt(e.target.value);
    const selectedSeason = tvShow.find(s => s.seasonNo === selectedSeasonNo)
    if (selectedSeason) {
      setEpisodesList(selectedSeason.episodes)
      setSelection(prev => ({...prev, season: selectedSeason.seasonNo}))
    }
  }

  const handleEpisodeChange = (e) => {
    const selectedEpisode = parseInt(e.target.value)
    setSelection(prev => ({...prev, episode: selectedEpisode}))
  }

  console.log(selection, "URL PARAM FOR API")
  
  const url = `https://vidsrc.xyz/embed/tv?tmdb=${selection.id}&season=${selection.season}&episode=${selection.episode}&ds_lang=en`

  return (
    <>
      <div className={styles["episode-select--container"]}>
        <label className={styles["input-label"]}>
          Season:
          <select className={styles["input-select"]} onChange={handleSeasonChange}>
            {tvShow.map((show) => 
              show.seasonNo !== 0 && (
                <option key={show.id} value={show.seasonNo}>{show.seasonNo}</option>
              )
            )}
          </select>
        </label>
        <label className={styles["input-label"]}>
          Episode:
          <select className={styles["input-select"]} onChange={handleEpisodeChange}>
            {episodesList.length === 0 || episodesList === null ? (
              <option value="n/a">N/A</option>
            ) : (
              episodesList.map((ep, i) => (
                <option key={i} value={ep}>{ep}</option>
              ))
            )}
          </select>
        </label>
      </div>
      <EmbedVideoModal url={url} title={title}/>
    </>
  )
}