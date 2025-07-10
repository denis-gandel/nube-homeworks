import { X } from "lucide-react";
import { Label } from "../../generals/label/Label";
import "./upload-file.css";
import { useRef, type ChangeEvent } from "react";

interface Props {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  fileType: "image" | "music";
}

export const UploadFile = ({ label, file, setFile, fileType }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const deleteFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="upload-file-component">
      <Label text={label} />
      <input
        type="file"
        accept={fileType === "image" ? "image/*" : "audio/*"}
        onChange={handleChange}
      />
      {file && (
        <div className="upload-file-selected-file frcb">
          <p>{file.name}</p>
          <button className="upload-file-delete-file fccc" onClick={deleteFile}>
            <X />
          </button>
        </div>
      )}
    </div>
  );
};
