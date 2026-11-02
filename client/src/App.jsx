import { Routes, Route } from "react-router";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { clearUser, setUser } from "./redux/features/auth/authSlice.js";
import { BASE_URL } from "./constants/urls.js";
import MainLayout from "./components/layout/MainLayout.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchMe();
    async function fetchMe() {
      try {
        const response = await axios.get(`${BASE_URL}/users/me`, {
          withCredentials: true,
        });
        dispatch(setUser(response.data.data.user));
      } catch {
        dispatch(clearUser());
      }
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
