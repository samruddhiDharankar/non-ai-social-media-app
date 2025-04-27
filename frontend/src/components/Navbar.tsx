/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/useAuthStore';
const VITE_API_URL = import.meta.env.VITE_API_URL;
function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch(`${VITE_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            // const data = await response.json();
            useAuthStore.getState().logout();
            navigate("/");
        } catch (err) {
            console.log("error", err);
        }
    }

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-bold text-pink-600 hover:text-pink-700 transition"
            >
                Dashboard
            </Link>

            {/* Mobile Hamburger Menu */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-pink-600 focus:outline-none"
                >
                    {/* Simple Hamburger Icon */}
                    <span className="block w-6 h-0.5 bg-pink-600 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-pink-600 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-pink-600"></span>
                </button>
            </div>

            {/* Desktop Menu Links */}
            <div className="hidden lg:flex gap-4">
                <Link
                    to="/create-post"
                    className="text-sm px-3 py-2 hover:text-pink-600 transition"
                >
                    Create Post
                </Link>
                <Link
                    to="/me"
                    className="text-sm px-3 py-2 hover:text-pink-600 transition"
                >
                    My Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm shadow transition"
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu Links */}
            <div
                className={`lg:hidden absolute top-full right-0 w-full bg-white shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}
            >
                <Link
                    to="/create-post"
                    onClick={() => setIsMenuOpen(false)}        // closes the menu after clicking 
                    className="block px-6 py-2 hover:bg-pink-50 hover:text-pink-600 transition rounded"
                >
                    Create Post
                </Link>
                <Link
                    to="/me"
                    onClick={() => setIsMenuOpen(false)}        // closes the menu after clicking  
                    className="block px-6 py-2 hover:bg-pink-50 hover:text-pink-600 transition rounded"
                >
                    My Profile
                </Link>
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                    }}
                    className="block w-full text-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl shadow transition text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar;
