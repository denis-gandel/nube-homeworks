import { useNavigate } from "react-router-dom";
import "./artist-card.css";

interface Props {
  name: string;
  genre: string;
  imageUrl: string;
  id: string;
}

export const ArtistCard = ({ name, genre, imageUrl, id }: Props) => {
  const navigate = useNavigate();

  const handleGoArtist = () => {
    navigate(`/artists/artist/${id}`);
  };

  const handleGoGenre = () => {
    navigate(`/genres/genre/${genre}`);
  };

  return (
    <div className="artist-card-component">
      <img src={imageUrl} alt="Artist card" className="artist-card-cover" />
      <div className="artist-card-text-section">
        <button
          className="artist-card-name artist-card-text"
          onClick={handleGoArtist}
        >
          {name}
        </button>
        <button
          className="artist-card-genre artist-card-text"
          onClick={handleGoGenre}
        >
          {genre}
        </button>
      </div>
    </div>
  );
};
