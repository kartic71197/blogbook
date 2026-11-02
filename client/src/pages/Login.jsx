import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../constants/urls.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth/authSlice.js";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      email: form.email.trim(),
      password: form.password,
    };
    if (!payload.email || !payload.password) {
      setErrors({ form: "Both fields are required" });
      return;
    }
    try {
      // -> server/src/controllers/auth.controller.js login
      const response = await axios.post(`${BASE_URL}/auth/login`, payload, { withCredentials: true });
      dispatch(setUser(response.data.data.user))
      navigate('/home');
    } catch (error) {
      const message =
        error.response?.data?.message ??
        "Something went wrong, please try again";
      setErrors({ form: message });
    }
  }
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center p-3">
          <div className="text-2xl font-bold w-full flex justify-center items-center">
            Login
          </div>
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <input
                className="border rounded-2xl px-3 py-1"
                type="text"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="py-2">
              <input
                className="border rounded-2xl px-3 py-1"
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            {errors.form && (
              <p className="mt-1 text-xs text-red-500">{errors.form}</p>
            )}
            <div className="py-2">
              <button
                className="w-full bg-blue-500 rounded-2xl px-3 py-1 cursor-pointer text-white"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          <div className="text-xs w-full flex justify-end">
            Dont have account?{" "}
            <Link className="text-blue-500 ml-1" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
