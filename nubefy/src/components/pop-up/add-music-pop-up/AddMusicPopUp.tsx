import { useEffect, useState } from "react";
import { usePlayerContext } from "../../../contexts/PlayerContext";
import { DropDown } from "../../inputs/drop-down/DropDown";
import { Input } from "../../inputs/input/Input";
import "./add-music-pop-up.css";
import { Button } from "../../buttons/button/Button";
import { usePopUpContext } from "../../../contexts/PopUpContext";
import { UploadFile } from "../../inputs/upload-file/UploadFile";

export const AddMusicPopUp = () => {
  const { artists, genres, createMusic, getArtists, getGenres } =
    usePlayerContext();
  const { closePopUp } = usePopUpContext();

  const [title, setTitle] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<Array<string>>([]);
  const [selectedArtistsId, setSelectedArtistsId] = useState<Array<string>>([]);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [artistsValues, setArtistsValues] = useState<Array<string>>([]);
  const [genresValues, setGenresValues] = useState<Array<string>>([]);

  const handleCreate = async () => {
    if (!musicFile || !imageFile) return;
    const result = await createMusic(
      title,
      selectedArtistsId,
      musicFile,
      genre,
      imageFile
    );
    if (result) {
      closePopUp();
      window.location.reload();
    }
  };

  useEffect(() => {
    const selectedIds = artists
      .filter((artist) => selectedArtists.includes(artist.name))
      .map((artist) => artist.id)
      .filter((id): id is string => typeof id === "string");

    setSelectedArtistsId(selectedIds);
  }, [selectedArtists, artists]);

  useEffect(() => {
    const foundGenre = genres.find((genre) =>
      selectedGenres.includes(genre.name)
    );
    if (foundGenre?.id) {
      setGenre(foundGenre.id);
    }
  }, [selectedGenres, genres]);

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

  useEffect(() => {
    getArtists();
    getGenres();
  }, []);

  return (
    <div className="add-music-pop-up-component pop-up-component">
      <h3 className="tcl">Add music</h3>
      <div className="add-music-pop-up-form">
        <Input
          label="Title"
          value={title}
          setValue={setTitle}
          placeholder="Pasito tun tun"
          htmlFor="add-music-pop-up-title"
        />
        <DropDown
          label="Artists"
          values={artistsValues}
          isMultiple={true}
          placeholder="Select artists..."
          selectedValues={selectedArtists}
          setValues={setSelectedArtists}
        />
        <UploadFile
          label="Upload file"
          file={musicFile}
          setFile={setMusicFile}
          fileType="music"
        />
        <DropDown
          label="Genres"
          values={genresValues}
          isMultiple={false}
          placeholder="Select genres..."
          selectedValues={selectedGenres}
          setValues={setSelectedGenres}
        />
        <UploadFile
          label="Upload image"
          file={imageFile}
          setFile={setImageFile}
          fileType="image"
        />
      </div>
      <div className="add-music-pop-up-actions">
        <Button text="Add" handleClick={handleCreate} />
        <Button text="Cancel" style="secondary" handleClick={closePopUp} />
      </div>
    </div>
  );
};
