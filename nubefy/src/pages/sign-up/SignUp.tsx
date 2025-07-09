import "./sign-up.css";
import Cover from "../../assets/sign-up-cover.jpg";
import { Input } from "../../components/inputs/input/Input";
import { useState } from "react";
import { Button } from "../../components/buttons/button/Button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export function SignUp() {
  const navigate = useNavigate();
  const {id, register, registerWithProvider } = useAuthContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = () => {
    navigate("/log-in");
  };

  const handleRegister = async () => {
    await register(username, email, password);
    if (id) navigate("/")
  };

  const handleRegisterWithGoogle = async () => {
    await registerWithProvider("google");
    if (id) navigate("/")
  };

  const handleRegisterWithFacebook = async () => {
    await registerWithProvider("facebook");
    if (id) navigate("/")
  };

  return (
    <div className="sign-up-page page">
      <div className="sign-up-page-form-section fccc">
        <h1>Sign up</h1>
        <div className="sign-up-page-form fccc">
          <Input
            label="Username"
            value={username}
            setValue={setUsername}
            htmlFor="sign-up-form-username-input"
            placeholder="nube_user"
          />
          <Input
            label="E-mail"
            value={email}
            setValue={setEmail}
            htmlFor="sign-up-form-email-input"
            placeholder="test@nubefy.com"
          />
          <Input
            label="Password"
            value={password}
            setValue={setPassword}
            htmlFor="sign-up-form-password-input"
            placeholder="Pass123"
            isSecret={true}
          />
        </div>
        <div className="sign-up-page-actions-section fccc">
          <Button text="Sign up" handleClick={handleRegister} />
          <Button
            text="Sign up with Google"
            style="secondary"
            handleClick={handleRegisterWithGoogle}
          />
          <Button
            text="Sign up with Facebook"
            style="secondary"
            handleClick={handleRegisterWithFacebook}
          />
          <Button
            text="I have an account"
            style="link"
            handleClick={handleLogIn}
          />
        </div>
      </div>
      <img
        src={Cover}
        alt="Sign up cover"
        className="sign-up-page-cover-section"
      />
    </div>
  );
}
