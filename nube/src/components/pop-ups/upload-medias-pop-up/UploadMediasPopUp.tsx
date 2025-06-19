import { usePopUpContext } from "../../../context/PopUpContext";
import { Button } from "../../buttons/button/Button";
import "./upload-medias-pop-up.css";
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

interface Props {
  setMedias: Dispatch<SetStateAction<File[]>>;
}

export const UploadMediasPopUp = ({ setMedias }: Props) => {
  const { closePopUp } = usePopUpContext();
  const [selectedMedias, setSelectedMedias] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILES = 5;
  const MAX_SIZE_MB = 5;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidSize = file.size <= MAX_SIZE_MB * 1024 * 1024;
      return isValidType && isValidSize;
    });

    const allFiles = [...selectedMedias, ...validFiles];

    const uniqueFiles = allFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    if (validFiles.length !== files.length) {
      setError(`Only images/videos under ${MAX_SIZE_MB}MB are allowed.`);
      return;
    }

    if (uniqueFiles.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }

    setError(null);
    setSelectedMedias(uniqueFiles);
  };

  const handleOkSelected = () => {
    setMedias(selectedMedias);
    closePopUp();
  };

  return (
    <div className="upload-medias-pop-up-component pop-up-component-container">
      <h2 className="pop-up-title">Upload Media</h2>
      <div className="upload-medias-section">
        <input
          type="file"
          id="upload-media-input"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
        />
        <ul className="file-preview-list">
          {selectedMedias.map((file, index) => (
            <li key={index}>
              {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
            </li>
          ))}
        </ul>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div className="button-section">
        {!error && <Button label="Ok" handleClick={handleOkSelected} />}
        <Button
          label="Cancel"
          handleClick={() => closePopUp()}
          style="secondary"
        />
      </div>
    </div>
  );
};
