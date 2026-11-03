import { useState } from "react";
import { useSelector } from "react-redux";
import { CalendarDays, Mail, Pencil } from "lucide-react";
import EditProfileForm from "../components/Profile/EditProfileForm";

const TABS = ["Posts", "About", "Friends"];

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState(TABS[0]);

    // user is null until GET /users/me answers
    if (!user) {
        return <p className="p-8 text-center text-gray-500">Loading...</p>;
    }

    const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <section className="bg-white shadow-sm">
                <div className="mx-auto max-w-5xl">
                    <div className="flex flex-col items-center gap-4 px-4 pb-4 pt-8 md:flex-row md:items-end md:px-8">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h1>
                            <div className="mt-1 flex flex-col items-center gap-1 text-sm text-gray-500 md:flex-row md:gap-4">
                                <span className="flex items-center gap-1">
                                    <Mail className="size-4" />
                                    {user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="size-4" />
                                    Joined {joined}
                                </span>
                            </div>
                        </div>

                        {!editMode && (
                            <button
                                type="button"
                                onClick={() => setEditMode(true)}
                                className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-200"
                            >
                                <Pencil className="size-4" />
                                Edit profile
                            </button>
                        )}
                    </div>

                    <nav className="flex gap-1 overflow-x-auto border-t border-gray-200 px-4 md:px-8">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`cursor-pointer border-b-4 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === tab
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-4 py-4 md:px-8">
                {editMode ? (
                    <EditProfileForm user={user} onDone={() => setEditMode(false)} />
                ) : (
                    <div className="grid gap-4 md:grid-cols-5">
                        <div className="rounded-xl bg-white p-4 shadow-sm md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-900">Intro</h2>
                            <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <Mail className="size-4 text-gray-400" />
                                    {user.email}
                                </li>
                                <li className="flex items-center gap-2">
                                    <CalendarDays className="size-4 text-gray-400" />
                                    Joined {joined}
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-xl bg-white p-4 text-center text-gray-500 shadow-sm md:col-span-3">
                            No posts yet
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;
