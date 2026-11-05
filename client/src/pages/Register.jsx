import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { validateRegister } from "../utils/validators.js";
import axios from "axios";
import {BASE_URL} from "../constants/urls.js"; 

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
  }`;

export const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
    };
    try {
      // -> server/src/controllers/auth.controller.js register
      await axios.post(`${BASE_URL}/auth/register`, payload, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      // No response means the server is unreachable (down, CORS, network)
      const message =
        error.response?.data?.message ?? "Something went wrong, please try again";
      setErrors({ form: message });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold text-blue-600">poetsociety</h1>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-center text-xl font-semibold text-gray-800">
          Create a new account
        </h2>
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                className={inputClass(errors.firstName)}
                type="text"
                placeholder="First name"
                name="firstName"
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                className={inputClass(errors.lastName)}
                type="text"
                placeholder="Last name"
                name="lastName"
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <input
              className={inputClass(errors.email)}
              type="email"
              name="email"
              placeholder="Email"
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
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <div>
            <input
              className={inputClass(errors.confirmPassword)}
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {errors.form && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errors.form}
            </p>
          )}
          <button
            className="w-full cursor-pointer rounded-lg bg-green-600 py-2 font-semibold text-white transition-colors hover:bg-green-700"
            type="submit"
          >
            Sign up
          </button>
        </form>
        <div className="my-5 border-t border-gray-200" />
        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <Link className="ml-1 font-medium text-blue-600 hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
