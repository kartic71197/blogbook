import { Routes, Route } from "react-router";
import {Login} from "./pages/Login.jsx";
import {Register} from "./pages/Register.jsx"
import {NotFound} from "./pages/NotFound.jsx"
import Home from "./pages/Home.jsx";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
