import { useState } from "react";
import { usePlayerContext } from "../../../contexts/PlayerContext";
import "./create-genre-pop-up.css";
import { Button } from "../../buttons/button/Button";
import { usePopUpContext } from "../../../contexts/PopUpContext";
import { Input } from "../../inputs/input/Input";
import { UploadFile } from "../../inputs/upload-file/UploadFile";

export const CreateGenrePopUp = () => {
  const { createGenre } = usePlayerContext();
  const { closePopUp } = usePopUpContext();

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleCreate = async () => {
    if (!file) return;
    const result = await createGenre(name, file);
    if (result) {
      closePopUp();
      window.location.reload();
    }
  };

  return (
    <div className="create-genre-pop-up-component pop-up-component">
      <h3>Create new genre</h3>
      <div className="create-genre-pop-up-form fccc">
        <Input
          label="Name"
          value={name}
          setValue={setName}
          htmlFor="create-genre-pop-up-form-name"
        />
        <UploadFile
          label="Upload cover genre"
          file={file}
          setFile={setFile}
          fileType="image"
        />
      </div>
      <div className="create-genre-pop-up-actions frcb">
        <Button text="Create" handleClick={handleCreate} />
        <Button text="Cancel" style="secondary" handleClick={closePopUp} />
      </div>
    </div>
  );
};
