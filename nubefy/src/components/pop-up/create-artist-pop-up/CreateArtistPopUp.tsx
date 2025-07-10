import { useEffect, useState } from "react";
import { usePlayerContext } from "../../../contexts/PlayerContext";
import { usePopUpContext } from "../../../contexts/PopUpContext";
import { Button } from "../../buttons/button/Button";
import "./create-artist-pop-up.css";
import { Input } from "../../inputs/input/Input";
import { DropDown } from "../../inputs/drop-down/DropDown";
import { UploadFile } from "../../inputs/upload-file/UploadFile";

export const CreateArtistPopUp = () => {
  const { closePopUp } = usePopUpContext();
  const { createArtist, getGenres, genres } = usePlayerContext();

  const [name, setName] = useState("");
  const [genresId, setGenresId] = useState<Array<string>>([]);
  const [genresValues, setGenresValues] = useState<Array<string>>([]);
  const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleCreateArtist = async () => {
    if (!file) return;
    const result = await createArtist(name, genresId, file);
    if (result) {
      closePopUp();
      window.location.reload();
    }
  };

  useEffect(() => {
    const genresList = genres.map((genre) => genre.name);
    setGenresValues(genresList);
  }, [genres]);

  useEffect(() => {
    const selectedIds = genres
      .filter((genre) => selectedGenres.includes(genre.name))
      .map((genre) => genre.id)
      .filter((id): id is string => typeof id === "string");

    setGenresId(selectedIds);
  }, [selectedGenres, genres]);

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <div className="create-artist-pop-up-component pop-up-component">
      <h3>Create a new artist</h3>
      <div className="create-artist-pop-up-form">
        <Input
          label="Name"
          value={name}
          setValue={setName}
          placeholder="John Doe"
          htmlFor="create-artist-pop-up-name"
        />
        <DropDown
          label="Genres"
          values={genresValues}
          selectedValues={selectedGenres}
          setValues={setSelectedGenres}
          isMultiple={true}
          placeholder="Select genres..."
        />
        <UploadFile
          label="Upload artist image"
          file={file}
          setFile={setFile}
          fileType="image"
        />
      </div>
      <div className="create-artist-pop-up-actions frcb">
        <Button text="Create" handleClick={handleCreateArtist} />
        <Button text="Cancel" style="secondary" handleClick={closePopUp} />
      </div>
    </div>
  );
};
