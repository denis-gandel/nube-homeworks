import { useEffect } from "react";
import { Button } from "../../../../../../components/buttons/button/Button";
import { ArtistCard } from "../../../../../../components/cards/artist-card/ArtistCard";
import { usePlayerContext } from "../../../../../../contexts/PlayerContext";
import { usePopUpContext } from "../../../../../../contexts/PopUpContext";
import "./artists.css";
import { CreateArtistPopUp } from "../../../../../../components/pop-up/create-artist-pop-up/CreateArtistPopUp";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

export function Artists() {
  const { getArtists, artists } = usePlayerContext();
  const { setPopUp } = usePopUpContext();
  const { user } = useAuthContext();

  const handleCreateArtist = () => setPopUp(<CreateArtistPopUp />);

  useEffect(() => {
    getArtists();
  }, []);

  return (
    <div className="artists-page page">
      <div className="artists-page-header frcb">
        <h1>Artists</h1>
        {user && user.role === "admin" && (
          <Button text="Create artist" handleClick={handleCreateArtist} />
        )}
      </div>
      <div className="artists-page-section">
        {artists && artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              name={artist.name}
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
