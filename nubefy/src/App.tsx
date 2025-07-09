import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBarMenu } from "./components/menu/nav-bar-menu/NavBarMenu";
import { LogIn } from "./pages/log-in/LogIn";
import { SignUp } from "./pages/sign-up/SignUp";
import { AppRoutes } from "./pages/app/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBarMenu />
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
