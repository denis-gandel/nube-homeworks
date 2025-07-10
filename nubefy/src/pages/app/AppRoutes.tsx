import { Route, Routes } from "react-router-dom";
import { MusicPlayer } from "../../components/music-player/MusicPlayer";
import { Home } from "./pages/home/Home";
import { usePlayerContext } from "../../contexts/PlayerContext";
import { GenresRoutes } from "./pages/genres/GenresRoutes";
import { ArtistsRoutes } from "./pages/artists/ArtistsRoutes";

export function AppRoutes() {
  const { music } = usePlayerContext();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genres/*" element={<GenresRoutes />} />
        <Route path="/artists/*" element={<ArtistsRoutes />} />
      </Routes>
      {music && <MusicPlayer />}
    </>
  );
}
