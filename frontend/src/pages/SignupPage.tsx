import { useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm"

const SignupPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/");
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center px-4">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-600">Create an Account</h2>
                    <SignupForm />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Already have an account?</p>
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="text-indigo-600 hover:underline mt-1 text-sm"
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