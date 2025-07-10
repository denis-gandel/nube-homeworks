import { useParams } from "react-router-dom";
import "./genre.css";
import { usePlayerContext } from "../../../../../../contexts/PlayerContext";
import { useEffect } from "react";
import { Button } from "../../../../../../components/buttons/button/Button";
import { usePopUpContext } from "../../../../../../contexts/PopUpContext";
import { ArtistCard } from "../../../../../../components/cards/artist-card/ArtistCard";
import { CreateArtistPopUp } from "../../../../../../components/pop-up/create-artist-pop-up/CreateArtistPopUp";

export function Genre() {
  const { id } = useParams();
  const { getGenre, genre, artists } = usePlayerContext();
  const { setPopUp } = usePopUpContext();

  const handleAddArtist = () => setPopUp(<CreateArtistPopUp />);

  useEffect(() => {
    if (!id) return;
    getGenre(id);
  }, [id]);

  return (
    <div className="genre-page page">
      <div className="genre-page-header frcc">
        <img src={genre?.imageUrl} alt="" className="genre-page-cover" />
        <div className="genre-page-info">
          <h1>{genre?.name}</h1>
          <p className="genre-page-total-artists">Artists: {artists.length}</p>
        </div>
      </div>
      <div className="genre-page-actions">
        <Button text="Add artist" handleClick={handleAddArtist} />
      </div>
      <div className="genre-page-artists">
        {artists && artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              name={artist.name}
              genre={genre?.name ?? ""}
              imageUrl={artist.imageUrl}
              id={artist.id ?? ""}
            />
          ))
        ) : (
          <p>Artists not found</p>
        )}
      </div>
    </div>
  );
}
