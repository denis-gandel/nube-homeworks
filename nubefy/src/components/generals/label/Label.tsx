import "./label.css";

interface Props {
  text: string;
  htmlFor: string;
}

export const Label = ({ text, htmlFor }: Props) => {
  return (
    <div className="label-component">
      <label htmlFor={htmlFor} className="label-text">
        {text}
      </label>
    </div>
  );
};
