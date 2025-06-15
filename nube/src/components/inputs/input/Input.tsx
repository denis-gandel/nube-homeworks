import { Label } from "../../labels/label/Label";
import { ErrorComponent } from "./components/error/Error";
import { InputView } from "./components/input-view/InputView";

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  isEditable?: boolean;
  isSecret?: boolean;
  error?: string;
}

export const Input = ({
  label = "",
  placeholder = "",
  value,
  setValue,
  isEditable = true,
  isSecret = false,
  error = "",
}: Props) => {
  return (
    <div className="input-component">
      {label && <Label text={label} />}
      <InputView
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        isEditable={isEditable}
        isSecret={isSecret}
      />
      {error && <ErrorComponent error={error} />}
    </div>
  );
};
