import { ArtistCard } from "../../../../components/cards/artist-card/ArtistCard";
import "./artists.css";

export function Artists() {
  return (
    <div className="artists-page page">
      <h1>Artists</h1>
      <div className="artists-page-section">
        <ArtistCard
          imageUrl="https://firebasestorage.googleapis.com/v0/b/mobile-dev-2025.firebasestorage.app/o/covers%2Fpop-music.jpg?alt=media&token=3d52ef5c-9e69-4b19-8cd3-5cd6c2dcca2e"
          name="Pop"
          genre="pop"
        />
      </div>
    </div>
  );
}
