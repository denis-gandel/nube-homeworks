import { useNavigate } from "react-router-dom";
import "./genre-card.css";

interface Props {
  imageUrl: string;
  name: string;
}

export const GenreCard = ({ imageUrl, name }: Props) => {
  const navigate = useNavigate();

  const handleGo = () => {
    navigate(`/genres/genre/${name}`);
  };

  return (
    <div className="genre-card-component">
      <img src={imageUrl} alt="Genre card" className="genre-card-cover" />
      <div className="genre-card-text-section">
        <button className="genre-card-text" onClick={handleGo}>
          {name}
        </button>
      </div>
    </div>
  );
};
