import { useState } from "react";
import "./drop-down.css";
import { Label } from "../../generals/label/Label";
import { DropDownView } from "./components/drop-down-view/DropDownView";

interface Props {
  label: string;
  values: string[];
  selectedValues: string[];
  setValues: (value: string[]) => void;
  isMultiple?: boolean;
  placeholder?: string;
}

export const DropDown = ({
  label,
  values,
  selectedValues,
  setValues,
  isMultiple = false,
  placeholder = "Select...",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (position: number) => {
    const auxValue = values[position];

    if (isMultiple) {
      const isAlreadySelected = selectedValues.includes(auxValue);

      const updatedValues = isAlreadySelected
        ? selectedValues.filter((val) => val !== auxValue)
        : [...selectedValues, auxValue];

      setValues(updatedValues);
    } else {
      setValues([auxValue]);
      setIsOpen(false);
    }
  };

  return (
    <div className="drop-down-component">
      <Label text={label} />
      <DropDownView
        values={values}
        selectedValues={selectedValues}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSelect={handleSelect}
        placeholder={placeholder}
      />
    </div>
  );
};
