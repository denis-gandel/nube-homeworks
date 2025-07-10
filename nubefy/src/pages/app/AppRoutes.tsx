import { Route, Routes } from "react-router-dom";
import { MusicPlayer } from "../../components/music-player/MusicPlayer";
import { Home } from "./pages/home/Home";
import { Artists } from "./pages/artists/Artists";
import { usePlayerContext } from "../../contexts/PlayerContext";
import { GenresRoutes } from "./pages/genres/GenresRoutes";

export function AppRoutes() {
  const { music } = usePlayerContext();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genres/*" element={<GenresRoutes />} />
        <Route path="/artists" element={<Artists />} />
      </Routes>
      {music && <MusicPlayer />}
    </>
  );
}
