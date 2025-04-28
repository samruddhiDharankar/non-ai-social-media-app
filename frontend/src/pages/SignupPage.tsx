'use client';
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm"

const SignupPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/");
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center px-4">
                <div className="max-w-100 mx-auto p-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-pink-600">Create an Account</h2>
                    <SignupForm />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Already have an account?</p>
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="text-pink-600 hover:underline mt-1 text-sm cursor-pointer"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default SignupPage;