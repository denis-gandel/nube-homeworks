import { useEffect } from "react";
import { ArtistCard } from "../../../../components/cards/artist-card/ArtistCard";
import { GenreCard } from "../../../../components/cards/genre-card/GenreCard";
import { usePlayerContext } from "../../../../contexts/PlayerContext";
import "./home.css";

export function Home() {
  const { getGenres, getArtists, genres, artists } = usePlayerContext();

  useEffect(() => {
    getGenres();
    getArtists();
  }, []);
  return (
    <div className="home-page page">
      <h1>Nubefy</h1>
      <div className="home-page-genres-section home-page-sections">
        <h2>Genre</h2>
        <div className="home-page-genres home-components">
          {genres && genres.length > 0 ? (
            genres.map((genre) => (
              <GenreCard
                key={genre.id}
                name={genre.name}
                imageUrl={genre.imageUrl}
                id={genre.id ?? ""}
              />
            ))
          ) : (
            <p>Genres not found</p>
          )}
        </div>
      </div>
      <div className="home-page-artists-section home-page-sections">
        <h2>Artist</h2>
        <div className="home-page-artists home-components">
          {artists && artists.length > 0 ? (
            artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                name={artist.name}
                imageUrl={artist.imageUrl}
                id={artist.id ?? ""}
              />
            ))
          ) : (
            <p>Artists not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
