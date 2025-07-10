import { Route, Routes } from "react-router-dom";
import { Genres } from "./pages/genres/Genres";
import { Genre } from "./pages/genre/Genre";

export function GenresRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Genres />} />
      <Route path="/genre/:id" element={<Genre />} />
    </Routes>
  );
}
