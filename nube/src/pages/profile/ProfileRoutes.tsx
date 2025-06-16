import { Route, Routes } from "react-router";
import { Profile } from "./profile/Profile";
import { MyPosts } from "./posts/MyPosts";

export function ProfileRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="/posts" element={<MyPosts />} />
    </Routes>
  );
}
