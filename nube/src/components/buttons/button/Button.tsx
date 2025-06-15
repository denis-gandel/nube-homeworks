import "./button.css"

interface Props {
  label?: string;
  handleClick?: () => void;
  style?: "primary" | "secondary" | "error" | "ok" | "link";
}

export const Button = ({
  label = "Button",
  handleClick = () => console.log("Click :D"),
  style = "primary",
}: Props) => {
  return (
    <button className={`button-component ${style}`} onClick={handleClick}>
      {label}
    </button>
  );
};
