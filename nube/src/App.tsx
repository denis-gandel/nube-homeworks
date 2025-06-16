import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/home/Home";
import { LogIn } from "./pages/log-in/LogIn";
import { Register } from "./pages/register/Register";
import { AuthProvider } from "./context/AuthContext";
import { ProfileRoutes } from "./pages/profile/ProfileRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me/*" element={<ProfileRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
