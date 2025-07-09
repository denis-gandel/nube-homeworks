import { useState } from "react";
import { useAuthContext } from "../../../../../contexts/AuthContext";
import "./profile.css";
import { LogOut } from "lucide-react";
import ProfileDefault from "../../../../../assets/user-default.png";

export const Profile = () => {
  const { user, logOut } = useAuthContext();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(!isOpen);

  const handleLogOut = () => {
    logOut();
    setIsOpen(false);
  };

  return (
    <>
      <button className="profile-component" onClick={handleOpen}>
        <img
          src={user?.imageUrl ?? ProfileDefault}
          alt="Profile"
          className="profile-image"
        />
      </button>
      {isOpen && (
        <div className="profile-options">
          <div className="profile-info fccc">
            <p className="profile-username tcl">{user?.username}</p>
            <p className="profile-email tcl">{user?.email}</p>
            <p className="profile-role tcl">{user?.role}</p>
          </div>
          <button className="profile-log-out frcc" onClick={handleLogOut}>
            <LogOut size={18} /> Log out
          </button>
        </div>
      )}
    </>
  );
};
