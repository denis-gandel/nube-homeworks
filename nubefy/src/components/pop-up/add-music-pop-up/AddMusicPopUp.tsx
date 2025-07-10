import { useEffect, useState } from "react";
import { usePlayerContext } from "../../../contexts/PlayerContext";
import { DropDown } from "../../inputs/drop-down/DropDown";
import { Input } from "../../inputs/input/Input";
import "./add-music-pop-up.css";

interface Props {
  title: string;
  setTitle: (value: string) => void;
  artistsId: string[];
  setArtistsId: (value: string[]) => void;
  musicFile: File | null;
  setMusicFile: (value: File | null) => void;
  genre: string;
  setGenre: (value: string) => void;
  imageFile: File | null;
  setImageFile: (value: File | null) => void;
}

export const AddMusicPopUp = ({
  title,
  setTitle,
  artistsId,
  setArtistsId,
  musicFile,
  setMusicFile,
  genre,
  setGenre,
  imageFile,
  setImageFile,
}: Props) => {
  const { artists, genres } = usePlayerContext();

  const [artistsValues, setArtistsValues] = useState<Array<string>>([]);
  const [genresValues, setGenresValues] = useState<Array<string>>([]);

  useEffect(() => {
    if (!artists) return;
    const artistsList = artists.map((a) => a.name);
    setArtistsValues(artistsList);
  }, [artists]);

  useEffect(() => {
    if (!genres) return;
    const genresList = genres.map((a) => a.name);
    setGenresValues(genresList);
  }, [genres]);

  return (
    <div className="add-music-pop-up-component pop-up-component">
      <h3 className="tcl">Add music</h3>
      <div className="add-music-pop-up-form">
        <Input
          label="Title"
          value={title}
          setValue={setTitle}
          placeholder="Music name"
          htmlFor="add-music-pop-up-title"
        />
        <DropDown
          value={artistsId}
          setMultipleValues={setArtistsId}
          values={artistsValues}
          multiple
        />
        <DropDown
          value={genre}
          setUniqueValue={setGenre}
          values={genresValues}
        />
      </div>
    </div>
  );
};
