import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuth, setIsAuth] = useState<null | boolean>(null);

    useEffect(() => {
        console.log("inside useE");

        const callAuth = async () => {
            try {
                console.log("inside try");

                const response = await fetch("http://localhost:3000/api/users/me", {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                console.log("auth response", result);
                setIsAuth(response.ok);
            } catch (err) {
                console.error("Auth check failed", err);
                setIsAuth(false);
            }
        }
        callAuth();
    }, [])

    console.log("isauth ", isAuth);
    if (isAuth === null) return <p>Loading...</p>
    if (!isAuth) return <Navigate to="/" />
    return children;
};

export default ProtectedRoute;