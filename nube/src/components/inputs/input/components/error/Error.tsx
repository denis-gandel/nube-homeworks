import "./error.css"

interface Props {
  error?: string;
}

export const ErrorComponent = ({ error = "" }: Props) => {
  return (
    <div className="error-component">
      <p className="error-text tcl">{error}</p>
    </div>
  );
};
