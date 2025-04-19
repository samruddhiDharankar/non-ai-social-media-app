import { useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm"

const Signup = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/");
    }

    return (
        <>
            <div>
                <h2>Create an account</h2>
                <SignupForm />
            </div>
            <div>
                <p>Already have an account?</p>
                <button type="button" onClick={handleLoginClick} >Login</button>
            </div>
        </>
    )
};

export default Signup;