import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import {
    Bell,
    ChevronDown,
    ChevronUp,
    CircleUserRound,
    House,
    LogOut,
    MessageCircle,
    MonitorPlay,
    Store,
    UserRound,
    Users,
} from "lucide-react";

const NAV_LINKS = [
    { to: "/home", label: "Home", icon: House },
    { to: "/friends", label: "Friends", icon: Users },
];

const iconButtonClass =
    "flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25";

const menuItemClass =
    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100";

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const menuRef = useRef(null);

    // Close the profile menu on a click outside it or on Escape
    useEffect(() => {
        if (!showProfileOptions) return;

        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowProfileOptions(false);
            }
        }
        function handleEscape(e) {
            if (e.key === "Escape") setShowProfileOptions(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showProfileOptions]);

    const closeMenu = () => setShowProfileOptions(false);

    return (
        <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between bg-blue-600 px-4 shadow-sm md:px-8">
            <Link to="/home" className="text-3xl font-bold text-white">
                blogbook
            </Link>

            <nav className="hidden h-full items-center gap-2 md:flex">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        aria-label={label}
                        title={label}
                        className={({ isActive }) =>
                            `flex h-11 w-20 items-center justify-center rounded-lg transition-colors ${
                                isActive ? "bg-white/20 text-white" : "text-blue-100 hover:bg-white/10"
                            }`
                        }
                    >
                        <Icon className="size-6" />
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-2">
                <button type="button" aria-label="Messages" className={iconButtonClass}>
                    <MessageCircle className="size-5" />
                </button>
                <button type="button" aria-label="Notifications" className={iconButtonClass}>
                    <Bell className="size-5" />
                </button>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setShowProfileOptions((prev) => !prev)}
                        aria-haspopup="menu"
                        aria-expanded={showProfileOptions}
                        className="flex cursor-pointer items-center gap-1 rounded-full py-1 pl-1 pr-2 text-white transition-colors hover:bg-white/15"
                    >
                        <CircleUserRound className="size-7" />
                        <span className="hidden text-sm font-medium sm:inline">{user?.firstName}</span>
                        {showProfileOptions ? (
                            <ChevronUp className="size-4" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                    </button>

                    {showProfileOptions && (
                        <div
                            role="menu"
                            className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-lg"
                        >
                            <div className="mb-1 border-b border-gray-100 px-3 pb-2 pt-1">
                                <p className="font-semibold text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="truncate text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <Link to="/profile" type="button" role="menuitem" onClick={closeMenu} className={menuItemClass}>
                                <UserRound className="size-4" />
                                Profile
                            </Link>
                            {/* Logout request is wired up later */}
                            <button type="button" role="menuitem" onClick={closeMenu} className={menuItemClass}>
                                <LogOut className="size-4" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
