import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import "../styles/contexts/pop-up-context.css";

interface Props {
  children: ReactNode;
}

interface Type {
  setPopUp: (popUp: ReactNode | null) => void;
  closePopUp: () => void;
}

const PopUpContext = createContext<Type | undefined>(undefined);

export const PopUpProvider = ({ children }: Props) => {
  const [popUp, setPopUp] = useState<ReactNode | null>(null);

  const closePopUp = () => {
    setPopUp(null);
  };

  const result = useMemo(
    () => ({
      setPopUp,
      closePopUp,
    }),
    []
  );

  return (
    <PopUpContext.Provider value={result}>
      {children}
      <div className={`pop-up-container ${popUp ? "is-visible" : "is-hidden"}`}>
        {popUp}
      </div>
    </PopUpContext.Provider>
  );
};

export const usePopUpContext = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error("usePopUpContext must be used within an PopUpPovider");
  }
  return context;
};
