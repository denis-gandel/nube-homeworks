import "./nav-bar-menu.css";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Button } from "../../buttons/button/Button";
import { Option } from "./components/option/Option";

export const NavBarMenu = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleLogIn = () => {
    navigate("/log-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <header className="nav-bar-menu-component">
      <button className="nav-bar-menu-logo-section frcc" onClick={handleHome}>
        <img src={Logo} alt="Nubefy logo" className="nav-bar-menu-logo" />
      </button>
      <div className="nav-bar-menu-options-sections frcc">
        <Option text="Home" path="/" />
        <Option text="Genres" path="/genres" />
        <Option text="Artists" path="/artists" />
      </div>
      <div className="nav-bar-menu-session-actions-section frcc">
        <Button text="Log in" style="secondary" handleClick={handleLogIn} />
        <Button text="Sign up" handleClick={handleSignUp} />
      </div>
    </header>
  );
};
