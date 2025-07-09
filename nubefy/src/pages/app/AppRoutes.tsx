import { Route, Routes } from "react-router-dom";
import { MusicPlayer } from "../../components/music-player/MusicPlayer";
import { Home } from "./pages/home/Home";
import { Genres } from "./pages/genres/Genres";
import { Artists } from "./pages/artists/Artists";
import { usePlayerContext } from "../../contexts/PlayerContext";

export function AppRoutes() {
  const { music } = usePlayerContext();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/artists" element={<Artists />} />
      </Routes>
      {music && <MusicPlayer />}
    </>
  );
}
