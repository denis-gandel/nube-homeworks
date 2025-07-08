import { ArtistCard } from "../../../../components/cards/artist-card/ArtistCard";
import { GenreCard } from "../../../../components/cards/genre-card/GenreCard";
import "./home.css";

export function Home() {
  return (
    <div className="home-page page">
      <h1>Nubefy</h1>
      <div className="home-page-genres-section home-page-sections">
        <h2>Genre</h2>
        <div className="home-page-genres home-components">
          <GenreCard
            imageUrl="https://firebasestorage.googleapis.com/v0/b/mobile-dev-2025.firebasestorage.app/o/covers%2Fpop-music.jpg?alt=media&token=3d52ef5c-9e69-4b19-8cd3-5cd6c2dcca2e"
            name="Pop"
          />
        </div>
      </div>
      <div className="home-page-artists-section home-page-sections">
        <h2>Artist</h2>
        <div className="home-page-artists home-components">
          <ArtistCard
            imageUrl="https://firebasestorage.googleapis.com/v0/b/mobile-dev-2025.firebasestorage.app/o/covers%2Fpop-music.jpg?alt=media&token=3d52ef5c-9e69-4b19-8cd3-5cd6c2dcca2e"
            name="Juliana Vegas"
            genre="Pop"
          />
        </div>
      </div>
    </div>
  );
}
