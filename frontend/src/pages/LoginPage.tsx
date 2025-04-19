import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"

const LoginPage = () => {

    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate("/signup");
    }

    return (
        <>
            <div>
                <h2>Login</h2>
                <LoginForm />
            </div>
            <div>
                <p>Don't have an account?</p>
                <button type="button" onClick={handleSignupClick}>Sign up</button>
            </div>
        </>
    )
};

export default LoginPage;