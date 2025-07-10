import "./drop-down-view.css";

interface Props {
  values: Array<string>;
  selectedValues: Array<string>;
  handleSelect: (position: number) => void;
  placeholder: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const DropDownView = ({
  values,
  selectedValues,
  handleSelect,
  placeholder,
  isOpen,
  setIsOpen,
}: Props) => {
  return (
    <>
      <button
        className="drop-down-view-value-component"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues && selectedValues.length > 0 ? (
          <p>{selectedValues.join(", ")}</p>
        ) : (
          <p>{placeholder}</p>
        )}
      </button>
      {isOpen && (
        <div className="drop-down-view-options-component">
          {values && values.length > 0 ? (
            values.map((value, index) => (
              <button
                key={`drop-down-view-option-index-${index}`}
                className={`drop-down-view-option ${
                  selectedValues.includes(value) ? "is-selected" : ""
                }`}
                onClick={() => handleSelect(index)}
              >
                {value}
              </button>
            ))
          ) : (
            <p>No values :c</p>
          )}
        </div>
      )}
    </>
  );
};
