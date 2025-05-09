'use client';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import TierAndPerksInfo from './TierAndPerksInfo';

export default function NavBar({ handleLogout }: { handleLogout: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            {/* Logo */}
            <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-bold text-pink-600 hover:text-pink-700 transition"
            >
                Non
            </Link>

            {/* Search */}
            <SearchBar />

            {/* Right-side buttons */}
            <div className="flex items-center gap-4 ml-4">
                {/* Always visible ? button */}
                <button
                    onClick={() => setShowInfo(true)}
                    title="What's this?"
                    className="text-sm px-3 py-2 hover:text-yellow-300 transition bg-pink-400 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shadow"
                >
                    ?
                </button>

                {/* Desktop-only buttons */}
                <div className="hidden lg:flex gap-2">
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
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm shadow transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-pink-600 focus:outline-none"
                    >
                        <span className="block w-6 h-0.5 bg-pink-600 mb-1"></span>
                        <span className="block w-6 h-0.5 bg-pink-600 mb-1"></span>
                        <span className="block w-6 h-0.5 bg-pink-600"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Links */}
            <div
                className={`lg:hidden absolute top-full right-0 w-full bg-white shadow-md ${isMenuOpen ? 'block' : 'hidden'
                    }`}
            >
                <Link
                    to="/create-post"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-2 hover:bg-pink-50 hover:text-pink-600 transition rounded"
                >
                    Create Post
                </Link>
                <Link
                    to="/me"
                    onClick={() => setIsMenuOpen(false)}
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

            {/* Modal Component */}
            <TierAndPerksInfo isVisible={showInfo} closeModal={() => setShowInfo(false)} />
        </nav>
    );
}
