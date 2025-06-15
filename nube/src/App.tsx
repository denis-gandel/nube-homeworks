import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/home/Home";
import { LogIn } from "./pages/log-in/LogIn";
import { Register } from "./pages/register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
