import styles from './Card.module.css'

export default function Card({ data, fetchDetails }) {

  return (
    <>  
      <img 
        className={styles['card--image']}
        src={`https://image.tmdb.org/t/p/w342/${data.poster_path}`} 
        alt={data.title}
        onClick={fetchDetails}
      />
    </>
  );
}