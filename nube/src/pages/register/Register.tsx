import { useState } from "react";
import { Input } from "../../components/inputs/input/Input";
import "./register.css";
import { Button } from "../../components/buttons/button/Button";
import { useNavigate } from "react-router";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <Button label="Register" />
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
          <Button label="Register with Google" style="secondary" />
          <Button label="Register with Facebook" style="secondary" />
        </div>
      </div>
    </div>
  );
}
