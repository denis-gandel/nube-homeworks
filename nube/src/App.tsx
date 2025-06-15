import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/home/Home";
import { LogIn } from "./pages/log-in/LogIn";
import { Register } from "./pages/register/Register";
import { AuthProvider } from "./context/AuthContext";
import { Profile } from "./pages/profile/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
