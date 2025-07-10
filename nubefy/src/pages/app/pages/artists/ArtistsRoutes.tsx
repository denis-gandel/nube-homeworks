import { Route, Routes } from "react-router-dom";
import { Artists } from "./pages/artists/Artists";
import { Artist } from "./pages/artist/Artist";

export function ArtistsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Artists />} />
      <Route path="/artist/:id" element={<Artist />} />
    </Routes>
  );
}
