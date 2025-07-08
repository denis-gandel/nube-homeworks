import { Route, Routes } from "react-router-dom";
import { MusicPlayer } from "../../components/music-player/MusicPlayer";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Nubefy</h1>} />
        <Route path="/genres" element={<h1>Genres</h1>} />
        <Route path="/artists" element={<h1>Artists</h1>} />
      </Routes>
      <MusicPlayer musicUrl="https://firebasestorage.googleapis.com/v0/b/mobile-dev-2025.firebasestorage.app/o/musics%2Fcryptic%20scenery%20-%20Morgengrauen.mp3?alt=media&token=0f08e837-29b9-4445-8a43-9e402b7b8766" />
    </>
  );
}
