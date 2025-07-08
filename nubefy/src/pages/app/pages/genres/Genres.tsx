import { GenreCard } from "../../../../components/cards/genre-card/GenreCard";
import "./genres.css";

export function Genres() {
  return (
    <div className="genres-page page">
      <h1>Genres</h1>
      <div className="genres-page-section">
        <GenreCard
          imageUrl="https://firebasestorage.googleapis.com/v0/b/mobile-dev-2025.firebasestorage.app/o/covers%2Fpop-music.jpg?alt=media&token=3d52ef5c-9e69-4b19-8cd3-5cd6c2dcca2e"
          name="Pop"
        />
      </div>
    </div>
  );
}
