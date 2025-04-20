import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        //TODO: call logout api
        navigate("/");
    }

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-semibold text-indigo-600 transition">
                Dashboard
            </Link>

            {/* Mobile Hamburger Menu */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-indigo-600 focus:outline-none"
                >
                    {/* Simple Hamburger Icon */}
                    <span className="block w-6 h-0.5 bg-indigo-600 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-indigo-600 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-indigo-600"></span>
                </button>
            </div>

            {/* Desktop Menu Links */}
            <div className="hidden lg:flex gap-4">
                <Link to="/create-post" className="hover:text-indigo-600 transition">
                    Create Post
                </Link>
                <Link to="/me" className="hover:text-indigo-600 transition">
                    My Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-500 transition"
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu Links */}
            {/* This is hidden by default, and only shown on mobile when hamburger is clicked */}
            <div
                className={`lg:hidden absolute top-full right-0 w-full bg-white shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}
            >
                <Link
                    to="/create-post"
                    onClick={() => setIsMenuOpen(false)}        // closes the menu after clicking 
                    className="block px-6 py-2 hover:text-indigo-600 transition">
                    Create Post
                </Link>
                <Link
                    to="/me"
                    onClick={() => setIsMenuOpen(false)}        // closes the menu after clicking  
                    className="block px-6 py-2 hover:text-indigo-600 transition">
                    My Profile
                </Link>
                <button
                    onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout();
                    }}
                    className="block w-full text-center bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-500 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
