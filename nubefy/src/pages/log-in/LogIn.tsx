import "./log-in.css";
import Cover from "../../assets/log-in-cover.jpg";
import { Input } from "../../components/inputs/input/Input";
import { useState } from "react";
import { Button } from "../../components/buttons/button/Button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export function LogIn() {
  const navigate = useNavigate();
  const { id, logIn, registerWithProvider } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleLogIn = async () => {
    await logIn(email, password);
    if (id) navigate("/");
  };

  const handleRegisterWithGoogle = async () => {
    await registerWithProvider("google");
    if (id) navigate("/");
  };

  const handleRegisterWithFacebook = async () => {
    await registerWithProvider("facebook");
    if (id) navigate("/");
  };

  return (
    <div className="log-in-page page">
      <img
        src={Cover}
        alt="Log in cover"
        className="log-in-page-cover-section"
      />
      <div className="log-in-page-form-section fccc">
        <h1>Log in</h1>
        <div className="log-in-page-form fccc">
          <Input
            label="E-mail"
            value={email}
            setValue={setEmail}
            htmlFor="log-in-form-email-input"
            placeholder="test@nubefy.com"
          />
          <Input
            label="Password"
            value={password}
            setValue={setPassword}
            htmlFor="log-in-form-password-input"
            placeholder="Pass123"
            isSecret={true}
          />
        </div>
        <div className="log-in-page-actions-section fccc">
          <Button text="Log in" handleClick={handleLogIn} />
          <Button
            text="Log in with Google"
            style="secondary"
            handleClick={handleRegisterWithGoogle}
          />
          <Button
            text="Log in with Facebook"
            style="secondary"
            handleClick={handleRegisterWithFacebook}
          />
          <div className="log-in-page-others-actions-section frcb">
            <Button
              text="I don't have an account"
              style="link"
              handleClick={handleSignUp}
            />
            <Button text="I don't remember my password" style="link" />
          </div>
        </div>
      </div>
    </div>
  );
}
