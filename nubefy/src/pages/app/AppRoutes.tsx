import { Route, Routes } from "react-router-dom";
import { MusicPlayer } from "../../components/music-player/MusicPlayer";
import { Home } from "./pages/home/Home";
import { Genres } from "./pages/genres/Genres";
import { Artists } from "./pages/artists/Artists";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/artists" element={<Artists />} />
      </Routes>
      <MusicPlayer musicUrl="https://firebasestorage.googleapis.com/v0/b/mobile-dev-2025.firebasestorage.app/o/musics%2Fcryptic%20scenery%20-%20Morgengrauen.mp3?alt=media&token=0f08e837-29b9-4445-8a43-9e402b7b8766" />
    </>
  );
}
