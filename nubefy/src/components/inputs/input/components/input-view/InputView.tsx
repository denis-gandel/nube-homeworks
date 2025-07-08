import { useState } from "react";
import "./input-view.css";
import { Eye, EyeClosed } from "lucide-react";

interface Props {
  value: string;
  setValue: (value: string) => void;
  isSecret?: boolean;
  placeholder?: string;
  htmlFor: string;
}

export const InputView = ({
  value,
  setValue,
  isSecret = false,
  placeholder = "",
  htmlFor,
}: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleVisible = () => {
    setIsVisible(!isVisible);
  };
  return (
    <div className={`input-view-component ${isSecret && "is-secret"}`}>
      <input
        type={`${isVisible ? "text" : "password"}`}
        name={htmlFor}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-view-section"
      />
      {isSecret && (
        <button className="input-view-visible-button" onClick={handleVisible}>
          {isVisible ? <Eye /> : <EyeClosed />}
        </button>
      )}
    </div>
  );
};
