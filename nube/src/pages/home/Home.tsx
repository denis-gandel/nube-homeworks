import { useNavigate } from "react-router";
import Logo from "../../assets/img/logo.png";
import { Button } from "../../components/buttons/button/Button";
import "./home.css";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page page fccc">
      <img src={Logo} alt="Nube logo" className="logo" width={300} />
      <div className="home-buttons-section frcc">
        <Button label="Log in" handleClick={() => navigate("/log-in")} />
        <Button
          label="Register"
          style="secondary"
          handleClick={() => navigate("/register")}
        />
      </div>
    </div>
  );
}
