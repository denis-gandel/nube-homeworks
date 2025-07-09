import { useEffect, useRef, useState } from "react";
import "./music-player.css";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePlayerContext } from "../../contexts/PlayerContext";

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {music} = usePlayerContext()
  const [isPlay, setIsPlay] = useState(false);
  const [percent, setPercent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlay) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlay(!isPlay);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      const progress = (audio.currentTime / audio.duration) * 100;
      setPercent(progress || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", () => setIsPlay(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", () => setIsPlay(false));
    };
  }, []);

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="music-player-component fccc">
      <div className="music-player-info-section">
        <h4 className="music-player-info-music-name">{music?.title}</h4>
        <p className="music-player-info-artist-name">{music?.artistsId}</p>
      </div>
      <div className="music-player-controls-section frcc">
        <button className="fccc music-player-control music-player-back">
          <SkipBack />
        </button>
        <button className="fccc music-player-main-control" onClick={togglePlay}>
          {isPlay ? (
            <Pause strokeWidth={0} fill="var(--foreground-color-light)" />
          ) : (
            <Play strokeWidth={0} fill="var(--foreground-color-light)" />
          )}
        </button>
        <button className="fccc music-player-control music-player-next">
          <SkipForward />
        </button>
      </div>
      <div className="music-player-range-section frcc">
        <p className="music-player-range-current-time music-player-range-time-text">
          {formatTime(currentTime)}
        </p>
        <div className="music-player-range">
          <div
            className="music-player-range-slider"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className="music-player-range-total-time music-player-range-time-text">
          {formatTime(duration)}
        </p>
      </div>
      <audio ref={audioRef}>
        <source src={music?.music} type="audio/mpeg" />
      </audio>
    </div>
  );
};
