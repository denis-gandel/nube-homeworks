import { useEffect } from "react";
import { GenreCard } from "../../../../../../components/cards/genre-card/GenreCard";
import { usePlayerContext } from "../../../../../../contexts/PlayerContext";
import "./genres.css";
import { Button } from "../../../../../../components/buttons/button/Button";
import { usePopUpContext } from "../../../../../../contexts/PopUpContext";
import { CreateGenrePopUp } from "../../../../../../components/pop-up/create-genre-pop-up/CreateGenrePopUp";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

export function Genres() {
  const { getGenres, genres } = usePlayerContext();
  const { setPopUp } = usePopUpContext();
  const { user } = useAuthContext();

  const handleCreateGenre = () => {
    setPopUp(<CreateGenrePopUp />);
  };

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <div className="genres-page page">
      <div className="genres-page-header frcb">
        <h1>Genres</h1>
        {user && user.role === "admin" && (
          <Button text="Create genre" handleClick={handleCreateGenre} />
        )}
      </div>
      <div className="genres-page-section">
        {genres && genres.length > 0 ? (
          genres.map((genre) => (
            <GenreCard
              key={genre.id}
              imageUrl={genre.imageUrl}
              name={genre.name}
              id={genre.id ?? ""}
            />
          ))
        ) : (
          <p>Genres not found :c</p>
        )}
      </div>
    </div>
  );
}
