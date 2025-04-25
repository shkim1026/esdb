import styles from './Card.module.css'
import { BsCheckCircle, BsPlusCircle } from 'react-icons/bs'

export default function Card({ data, handleClick, user }) {

  return (
    <>  
      <div>
      <img 
        className={styles['card--image']}
        src={`https://image.tmdb.org/t/p/w342/${data.poster_path}`} 
        alt={data.title}
        onClick={handleClick}
      />
      </div>
    </>
  );
}