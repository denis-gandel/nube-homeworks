import { useLocation, useNavigate } from "react-router-dom";
import "./option.css";
import { useEffect, useState } from "react";

interface Props {
  text: string;
  path: string;
}

export const Option = ({ text, path }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSelected, setIsSelected] = useState(false);

  const handleGo = () => {
    navigate(path);
  };

  useEffect(() => {
    const url = location.pathname;
    setIsSelected(url === path);
  }, [location, path]);

  return (
    <button
      className={`nav-bar-menu-option-component ${
        isSelected ? "is-selected" : ""
      }`}
      onClick={handleGo}
    >
      {text}
    </button>
  );
};
