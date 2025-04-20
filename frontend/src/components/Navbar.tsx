import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        //TODO: call logout api
        navigate("/");
    }

    return (
        <>
            <nav className='bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50'>
                <Link to="/dashboard" className="text-xl front-semibold text-indigo-600 transition">
                    AuthRate
                </Link>

                <div className='flex gap-4'>
                    <Link to="/dashboard" className='hover:text-indigo-600 transition'>
                        Dashboard
                    </Link>

                    <Link to="/create-post" className='hover:text-indigo-600 transition'>
                        Create Post
                    </Link>

                    <Link to="/me" className='hover:text-indigo-600 transition'>
                        My Profile
                    </Link>
                    <button onClick={handleLogout} className='bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-500 transition'>
                        Logout
                    </button>
                </div>
            </nav>
        </>
    )
}

export default Navbar
