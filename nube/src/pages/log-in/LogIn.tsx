import { useState } from "react";
import { Input } from "../../components/inputs/input/Input";
import "./log-in.css";
import { Button } from "../../components/buttons/button/Button";
import { ErrorComponent } from "../../components/inputs/input/components/error/Error";
import { useNavigate } from "react-router";

export function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="log-in-page page fccc">
      <h1>Log In</h1>
      <div className="log-in-form fca">
        <Input label="E-mail" value={email} setValue={setEmail} />
        <Input
          label="Password"
          value={password}
          setValue={setPassword}
          isSecret={true}
        />
        {error && <ErrorComponent error={error} />}
      </div>
      <div className="log-in-buttons-section">
        <div className="log-in-main-actions fccc">
          <Button label="Log in" />
          <div className="log-in-main-actions-others frcc">
            <Button
              label="Forgot my password"
              style="link"
              handleClick={() => navigate("/log-in/forgot-password")}
            />
            <Button
              label="I don't have an account"
              style="link"
              handleClick={() => navigate("/register")}
            />
          </div>
        </div>
        <div className="log-in-others">
          <div className="log-in-others-text tcc">Or</div>
          <Button label="Log in with Google" style="secondary" />
          <Button label="Log in with Facebook" style="secondary" />
        </div>
      </div>
    </div>
  );
}
