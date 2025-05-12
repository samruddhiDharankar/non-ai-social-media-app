import { useEffect } from "react";
import { useAuthStore } from "../utils/useAuthStore";
import { useNavigate } from "react-router-dom";

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const VITE_API_URL = import.meta.env.VITE_API_URL;

function GoogleLoginButton() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeGoogle = () => {
            if (!(window as any).google) return;

            (window as any).google.accounts.id.initialize({
                client_id: VITE_GOOGLE_CLIENT_ID as string,
                callback: handleGoogleLogin,
            });

            const buttonContainer = document.getElementById("google-signin-btn");

            if (buttonContainer && buttonContainer.childNodes.length === 0) {
                (window as any).google.accounts.id.renderButton(buttonContainer, {
                    theme: "outline",
                    size: "large",
                });
            }

            (window as any).google.accounts.id.prompt();
        };

        if (!(window as any).google) {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogle;
            document.body.appendChild(script);
        } else {
            initializeGoogle();
        }

        // 🧹 Clear button on unmount so it can re-render next time
        return () => {
            const btn = document.getElementById("google-signin-btn");
            if (btn) btn.innerHTML = "";
        };
    }, []);

    const handleGoogleLogin = async (response: { credential: string }) => {
        const res = await fetch(`${VITE_API_URL}/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: response.credential }),
        });

        const data = await res.json();

        localStorage.setItem("accessToken", data.user.token);
        localStorage.setItem("refreshToken", data.user.refreshToken);

        if (res.ok) {
            setUser({
                userId: data.user._id,
                username: data.user.username,
            });

            setTimeout(() => {
                navigate("/dashboard");
            }, 50);
        }
    };

    return <div id="google-signin-btn" className="w-full py-2 rounded-md"></div>;
}

export default GoogleLoginButton;
