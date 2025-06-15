import { useState } from "react";
import { Input } from "../../components/inputs/input/Input";
import "./register.css";
import { Button } from "../../components/buttons/button/Button";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

export function Register() {
  const { register, registerWithProvider } = useAuthContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await register(name, email, password);
    navigate("/profile");
  };

  const handleRegisterWithGoogle = async () => {
    await registerWithProvider("google");
    navigate("/profile")
  };

  const handleRegisterWithFacebook = async () => {
    await registerWithProvider("facebook");
    navigate("/profile")
  };

  return (
    <div className="register-page page fccc">
      <h1>Register</h1>
      <div className="register-form fca">
        <Input label="Full name" value={name} setValue={setName} />
        <Input label="E-mail" value={email} setValue={setEmail} />
        <Input
          label="Password"
          value={password}
          setValue={setPassword}
          isSecret
        />
      </div>
      <div className="register-buttons-section">
        <div className="register-main-actions fccc">
          <Button label="Register" handleClick={handleRegister} />
          <div className="register-main-actions-others frcc">
            <Button
              label="I have an account"
              style="link"
              handleClick={() => navigate("/log-in")}
            />
          </div>
        </div>
        <div className="register-others">
          <div className="register-others-text tcc">Or</div>
          <Button
            label="Register with Google"
            handleClick={handleRegisterWithGoogle}
            style="secondary"
          />
          <Button
            label="Register with Facebook"
            handleClick={handleRegisterWithFacebook}
            style="secondary"
          />
        </div>
      </div>
    </div>
  );
}
