import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuth, setIsAuth] = useState<null | boolean>(null);

    useEffect(() => {
        const callAuth = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/me", {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                setIsAuth(response.ok);
            } catch (err) {
                console.error("Auth check failed", err);
                setIsAuth(false);
            }
        }
        callAuth();

    }, [])

    if (isAuth === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    if (!isAuth) return <Navigate to="/" />     // navigates back to login
    return children;
};

export default ProtectedRoute;