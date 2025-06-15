import { useAuthContext } from "../../context/AuthContext";
import UserDefault from "../../assets/img/user-default.png";
import "./profile.css";
import { Button } from "../../components/buttons/button/Button";
import { useNavigate } from "react-router";
import { Input } from "../../components/inputs/input/Input";
import { useEffect } from "react";

export function Profile() {
  const navigate = useNavigate();
  const { user, logOut, linkProvider } = useAuthContext();

  const handleLogOut = async () => {
    await logOut();
    navigate("/");
  };

  const handleLinkFacebook = async () => {
    const success = await linkProvider("facebook");
    if (success) {
      alert("Facebook account linked successfully!");
    }
  };

  const handleLinkGoogle = async () => {
    const success = await linkProvider("google");
    if (success) {
      alert("Google account linked successfully!");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/log-in")
    }
  }, [user])

  return (
    <div className="profile-page page fccc">
      <h1>Profile</h1>
      <div className="profile-info-section fca">
        <img
          src={user?.photoURL ?? UserDefault}
          alt="Profile"
          className="profile-img"
          width={300}
          height={300}
        />
        <Input
          label="Full name"
          value={user?.displayName ?? "User name"}
          setValue={() => {}}
          isEditable={false}
        />
        <Input
          label="E-mail"
          value={user?.email ?? "test@nube.com"}
          setValue={() => {}}
          isEditable={false}
        />
        <Input
          label="Creation date"
          value={user?.metadata.creationTime ?? "Never"}
          setValue={() => {}}
          isEditable={false}
        />
      </div>
      <div className="profile-buttons-section">
        <div className="profile-main-actions fccc">
          <Button label="Log out" style="error" handleClick={handleLogOut} />
          <div className="profile-main-actions-others frcc">
            <Button
              label="Forgot my password"
              style="link"
              handleClick={() => navigate("/log-in/forgot-password")}
            />
          </div>
        </div>
        <div className="profile-others">
          <div className="profile-others-text tcc">Link with</div>
          {user?.providerData.some(
            (provider) => provider.providerId === "google.com"
          ) ? (
            <Button
              label="Linked to Google"
              handleClick={() => {}}
              style="secondary"
            />
          ) : (
            <Button
              label="Link with Google"
              handleClick={handleLinkGoogle}
              style="secondary"
            />
          )}

          {user?.providerData.some(
            (provider) => provider.providerId === "facebook.com"
          ) ? (
            <Button
              label="Linked to Facebook"
              handleClick={() => {}}
              style="secondary"
            />
          ) : (
            <Button
              label="Link with Facebook"
              handleClick={handleLinkFacebook}
              style="secondary"
            />
          )}
        </div>
      </div>
    </div>
  );
}
