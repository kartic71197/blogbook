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
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center p-3">
          <div className="text-xl font-bold w-full flex justify-center items-center">
            Create an account
          </div>
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <input
                className="border rounded-2xl px-3 py-1"
                type="text"
                placeholder="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="py-2">
              <input
                className="border rounded-2xl px-3 py-1"
                type="text"
                placeholder="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
            <div className="py-2">
              <input
                className="border rounded-2xl px-3 py-1"
                type="email"
                name="email"
                placeholder="Email"
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
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="py-2">
              <input
                className="border rounded-2xl px-3 py-1"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
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
                Register
              </button>
            </div>
          </form>
          <div className="text-xs w-full flex justify-end">
            Already have account?{" "}
            <Link className="text-blue-500 ml-1" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
