import "./button.css";

interface Props {
  text?: string;
  handleClick?: () => void;
  style?: "primary" | "secondary" | "link";
}

export const Button = ({
  text = "Button",
  handleClick = () => {},
  style = "primary",
}: Props) => {
  return (
    <button className={`button-component ${style}`} onClick={handleClick}>
      {text}
    </button>
  );
};
