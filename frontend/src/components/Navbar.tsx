'use client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/useAuthStore';
import SearchBar from './SearchBar';
import TierAndPerksInfo from './TierAndPerksInfo';
import DarkModeToggler from './DarkModeToggler';
const VITE_API_URL = import.meta.env.VITE_API_URL;
function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const token = localStorage.getItem("accessToken");

    const handleLogout = async () => {
        try {
            await fetch(`${VITE_API_URL}/auth/logout`, {
                method: "POST",
                // credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            // const data = await response.json();
            useAuthStore.getState().logout();
            localStorage.clear();
            navigate("/");
        } catch (err) {
            console.log("error", err);
        }
    }

    return (
        <nav className="navbar-background shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className='flex gap-3'>
                {/* Logo */}
                <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="heading-text text-xl font-bold"
                >
                    Non
                </Link>
                <Link to="https://forms.gle/rf2cw7LCDtL1fX6i8" className='primary-text py-1 font-bold cursor-pointer'>
                    Feedback
                </Link>
            </div>

            {/* Search */}
            <SearchBar />

            {/* Right-side buttons */}
            <div className="flex items-center gap-4 ml-4">
                <DarkModeToggler />
                {/* Always visible ? button */}
                <button
                    onClick={() => setShowInfo(true)}
                    title="What's this?"
                    className="heading-text text-sm px-3 py-2 rounded-full w-5 h-5 flex items-center justify-center font-bold shadow cursor-pointer"
                >
                    ?
                </button>

                {/* Desktop-only buttons */}
                <div className="hidden lg:flex gap-2">
                    <Link
                        to="/create-post"
                        className="secondary-text text-sm px-3 py-2"
                    >
                        Create Post
                    </Link>
                    <Link
                        to="/me"
                        className="secondary-text text-sm px-3 py-2"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="send-button px-4 py-2 rounded-xl text-sm shadow"
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="heading-text focus:outline-none"
                    >
                        <span className="block w-6 h-0.5 send-button mb-1"></span>
                        <span className="block w-6 h-0.5 send-button mb-1"></span>
                        <span className="block w-6 h-0.5 send-button"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Links */}
            <div
                className={`lg:hidden absolute top-full right-0 w-full navbar-background shadow-md ${isMenuOpen ? 'block' : 'hidden'
                    }`}
            >
                <Link
                    to="/create-post"
                    onClick={() => setIsMenuOpen(false)}
                    className="secondary-text block px-6 py-2 rounded"
                >
                    Create Post
                </Link>
                <Link
                    to="/me"
                    onClick={() => setIsMenuOpen(false)}
                    className="secondary-text block px-6 py-2 rounded"
                >
                    My Profile
                </Link>
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                    }}
                    className="send-button block w-full text-center px-4 py-2 rounded-xl shadow transition text-sm"
                >
                    Logout
                </button>
            </div>

            {/* Modal Component */}
            <TierAndPerksInfo isVisible={showInfo} closeModal={() => setShowInfo(false)} />
        </nav>
    );
}

export default Navbar;