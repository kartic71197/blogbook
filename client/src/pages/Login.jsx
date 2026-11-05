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

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
  }`;

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="mb-6 text-4xl font-bold text-blue-600">poetsociety</h1>
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-center text-xl font-semibold text-gray-800">
          Log in to your account
        </h2>
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-3">
          <div>
            <input
              className={inputClass(errors.email)}
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              className={inputClass(errors.password)}
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          {errors.form && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errors.form}
            </p>
          )}
          <button
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
            type="submit"
          >
            Log in
          </button>
        </form>
        <div className="my-5 border-t border-gray-200" />
        <p className="text-center text-sm text-gray-600">
          Don't have an account?
          <Link className="ml-1 font-medium text-blue-600 hover:underline" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
