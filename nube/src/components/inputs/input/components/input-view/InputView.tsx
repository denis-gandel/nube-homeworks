import { useEffect, useState } from "react";
import "./input-view.css";
import { Eye, EyeClosed } from "lucide-react";

interface Props {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  isEditable?: boolean;
  isSecret?: boolean;
}

export const InputView = ({
  placeholder = "",
  value,
  setValue,
  isEditable = true,
  isSecret = false,
}: Props) => {
  const [type, setType] = useState("text");
  const [isVisible, setIsVisible] = useState(true);

  const handleType = () => {
    if (isSecret) {
      isVisible ? setType("text") : setType("password");
    }
  };

  const handleVisibleStatus = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (isSecret) {
      setType("password");
    }
  }, [isSecret]);

  useEffect(() => {
    handleType();
  }, [isVisible]);

  return (
    <div className="input-view-component frcc">
      <input
        type={type}
        className="input-view"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        contentEditable={isEditable}
      />
      {isSecret && (
        <button
          className="is-secret-button-change fccc"
          onClick={handleVisibleStatus}
        >
          {isVisible ? <Eye /> : <EyeClosed />}
        </button>
      )}
    </div>
  );
};
