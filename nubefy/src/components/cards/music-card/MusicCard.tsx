import { Play } from "lucide-react";
import type { Music } from "../../../models/Music";
import "./music-card.css";
import { usePlayerContext } from "../../../contexts/PlayerContext";

interface Props {
  music: Music;
  index: number;
}

export const MusicCard = ({ music, index }: Props) => {
  const { setSelectedMusic } = usePlayerContext();
  return (
    <div className="music-card-component frcb">
      <div className="music-card-info frcc">
        <img
          src={music.imageUrl}
          alt="Music card cover"
          className="music-card-cover"
        />
        <p className="music-card-title">{music.title}</p>
      </div>
      <button
        className="music-card-play-button fccc"
        onClick={() => setSelectedMusic(index)}
      >
        <Play strokeWidth={0} fill="var(--foreground-color-normal)" />
      </button>
    </div>
  );
};
