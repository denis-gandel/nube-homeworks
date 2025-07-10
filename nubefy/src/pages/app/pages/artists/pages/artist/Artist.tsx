import { useParams } from "react-router-dom";
import { usePlayerContext } from "../../../../../../contexts/PlayerContext";
import "./artist.css";
import { useEffect } from "react";
import { Button } from "../../../../../../components/buttons/button/Button";
import { MusicCard } from "../../../../../../components/cards/music-card/MusicCard";
import { usePopUpContext } from "../../../../../../contexts/PopUpContext";
import { AddMusicPopUp } from "../../../../../../components/pop-up/add-music-pop-up/AddMusicPopUp";
import { useAuthContext } from "../../../../../../contexts/AuthContext";

export function Artist() {
  const { id } = useParams();
  const { getArtist, artist, musics } = usePlayerContext();
  const { setPopUp } = usePopUpContext();
  const { user } = useAuthContext();

  const handleAddMusic = () => setPopUp(<AddMusicPopUp />);

  useEffect(() => {
    if (id) getArtist(id);
  }, []);

  return (
    <div className="artist-page page">
      <div className="artist-page-header frcc">
        <img src={artist?.imageUrl} alt="" className="artist-page-cover" />
        <div className="artist-page-info">
          <h1>{artist?.name}</h1>
          <p className="artist-page-total-musics">Musics: {musics.length}</p>
        </div>
      </div>
      <div className="artist-page-actions">
        {user && user.role === "admin" && (
          <Button text="Add music" handleClick={handleAddMusic} />
        )}
      </div>
      <div className="artist-page-musics">
        {musics && musics.length > 0 ? (
          musics.map((music, index) => (
            <MusicCard key={music.id} music={music} index={index} />
          ))
        ) : (
          <p>Musics not found</p>
        )}
      </div>
    </div>
  );
}
