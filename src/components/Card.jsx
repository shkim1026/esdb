export default function Card({ data, handleClick }) {

  return (
    <>  
      <img 
        className="card--image" 
        src={`https://image.tmdb.org/t/p/original/${data.poster_path}`} 
        alt={data.title}
        onClick={handleClick}
      />
    </>
  );
}