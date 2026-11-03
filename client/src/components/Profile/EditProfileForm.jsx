import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../constants/urls";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/auth/authSlice";

const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

const EditProfileForm = ({ user, onDone }) => {
    const dispatch = useDispatch();
    const INITIAL_FORM = {
        firstName: user.firstName,
        lastName: user.lastName,
    };
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(INITIAL_FORM);
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev, [name]: value
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
        };
        if (!payload.firstName || !payload.lastName) {
            setErrors({ form: "Both fields are required" });
            return;
        }
        try {
            // -> server/src/controllers/user.controller.js updateMe
            const response = await axios.patch(`${BASE_URL}/users/me`, payload, { withCredentials: true });
            dispatch(setUser(response.data.data.user));
            onDone();
        } catch (error) {
            // No response means the server is unreachable (down, CORS, network)
            const message =
                error.response?.data?.message ?? "Something went wrong, please try again";
            setErrors({ form: message });
        }
    }
    return (
        <form onSubmit={handleSubmit} noValidate className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Edit profile</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                        First name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                        Last name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
            </div>

            {errors.form && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onDone}
                    className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Save changes
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm;
