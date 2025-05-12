import { useEffect } from "react"
import { useAuthStore } from "../utils/useAuthStore";
import { useNavigate } from "react-router-dom";
const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID;

function GoogleLoginButton() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();
    useEffect(() => {
        const loadGoogleScript = () => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = () => {
                (window as any).google.accounts.id.initialize({
                    client_id: "889144470561-qho5nku0rhv4hlup6n1r3nh851e58aql.apps.googleusercontent.com",
                    callback: handleGoogleLogin,
                });
                (window as any).google.accounts.id.renderButton(
                    document.getElementById("google-signin-btn"),
                    { theme: "outline", size: "large" }
                );
            };
        };

        if (!(window as any).google) loadGoogleScript();
        else (window as any).google.accounts.id.prompt();
    }, []);

    const handleGoogleLogin = async (response) => {
        console.log(response);
        const res = await fetch("http://localhost:3000/api/auth/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: response.credential }),
            // credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        localStorage.setItem("accessToken", data.user.token);
        localStorage.setItem("refreshToken", data.user.refreshToken);
        if (res.ok) {
            console.log("Logged in");

            setUser({
                userId: data.user._id,
                username: data.user.username
            });

            setTimeout(() => {

                navigate("/dashboard");
            }, 50);
        }
    }

    return (
        <div id="google-signin-btn"></div>
    )
}

export default GoogleLoginButton
