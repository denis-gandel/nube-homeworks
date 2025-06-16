import { useAuthContext } from "../../context/AuthContext";
import UserDefault from "../../assets/img/user-default.png";
import "./profile.css";
import { Button } from "../../components/buttons/button/Button";
import { useNavigate } from "react-router";
import { Input } from "../../components/inputs/input/Input";
import { useEffect } from "react";

export function Profile() {
  const navigate = useNavigate();
  const { user, logOut, linkProvider, nameProviders } = useAuthContext();

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
      navigate("/log-in");
    }
  }, [user]);

  return (
    <div className="profile-page page fccc">
      <h1>Profile</h1>
      <div className="profile-info-section fca">
        <img
          src={
            user?.profileImg && user.profileImg.trim() !== ""
              ? user.profileImg
              : UserDefault
          }
          alt="Profile"
          className="profile-img"
          width={300}
          height={300}
        />
        <Input
          label="Full name"
          value={user?.fullName ?? "User name"}
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
          label="Birth date"
          value={user?.birthDate ?? "Never"}
          setValue={() => {}}
          isEditable={false}
        />
        <Input
          label="Age"
          value={`${user?.age}`}
          setValue={() => {}}
          isEditable={false}
        />
        <Input
          label="Address"
          value={user?.address ?? "Av IDK"}
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
          {nameProviders.includes("google.com") ? (
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

          {nameProviders.includes("facebook.com") ? (
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
