import { Label } from "../../generals/label/Label";
import { InputView } from "./components/input-view/InputView";
import "./input.css";

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  htmlFor: string;
  isSecret?: boolean;
}

export const Input = ({
  label,
  placeholder,
  value,
  setValue,
  htmlFor,
  isSecret = false,
}: Props) => {
  return (
    <div className="input-component">
      {label && <Label text={label} htmlFor={htmlFor} />}
      <InputView
        value={value}
        setValue={setValue}
        placeholder={placeholder}
        htmlFor={htmlFor}
        isSecret={isSecret}
      />
    </div>
  );
};
