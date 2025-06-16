import { Trash } from "lucide-react";
import "./delete-button.css";

interface Props {
  handleClick: () => void;
}

export const DeleteButton = ({ handleClick }: Props) => {
  return (
    <button className="delete-button-component fccc" onClick={handleClick}>
      <Trash />
    </button>
  );
};
