import "./label.css";

interface Props {
  text: string;
}

export const Label = ({ text }: Props) => {
  return (
    <div className="label-component">
      <p className="label-text tcl">{text}</p>
    </div>
  );
};
