import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"

const LoginPage = () => {

    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate("/signup");
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center px-4 ">
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-pink-600">Login</h2>
                    <LoginForm />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Don't have an account?</p>
                        <button className="text-pink-600 hover:underline mt-1 text-sm cursor-pointer"
                            type="button"
                            onClick={handleSignupClick}>
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default LoginPage;