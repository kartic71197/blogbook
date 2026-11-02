import { Outlet } from "react-router"
import Navbar from "./Navbar.jsx"

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
