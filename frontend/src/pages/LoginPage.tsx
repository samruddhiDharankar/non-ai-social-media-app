import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"

const LoginPage = () => {

    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate("/signup");
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center px-4">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-600">Login</h2>
                    <LoginForm />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Don't have an account?</p>
                        <button className="text-indigo-600 hover:underline mt-1 text-sm"
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