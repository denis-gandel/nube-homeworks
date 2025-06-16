import { useState } from "react";
import { Input } from "../../components/inputs/input/Input";
import "./log-in.css";
import { Button } from "../../components/buttons/button/Button";
import { ErrorComponent } from "../../components/inputs/input/components/error/Error";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

export function LogIn() {
  const navigate = useNavigate();
  const { logIn, registerWithProvider, signInError } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async () => {
    if (email && password) {
      await logIn(email, password);
      if (!signInError) {
        navigate("/me");
      }
    }
  };

  const handleLogInWithGoogle = async () => {
    await registerWithProvider("google");
    if (!signInError) {
      navigate("/me");
    }
  };

  const handleLogInWithFacebook = async () => {
    await registerWithProvider("facebook");
    if (!signInError) {
      navigate("/me");
    }
  };

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
        {signInError && <ErrorComponent error={signInError} />}
      </div>
      <div className="log-in-buttons-section">
        <div className="log-in-main-actions fccc">
          <Button label="Log in" handleClick={handleLogIn} />
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
          <Button
            label="Log in with Google"
            handleClick={handleLogInWithGoogle}
            style="secondary"
          />
          <Button
            label="Log in with Facebook"
            handleClick={handleLogInWithFacebook}
            style="secondary"
          />
        </div>
      </div>
    </div>
  );
}
