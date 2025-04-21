// components/ProtectedRoute.tsx
import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../utils/useAuthStore";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const user = useAuthStore((state) => state.user);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const unsub = useAuthStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        // safety: handle case where it's already hydrated
        if (useAuthStore.persist.hasHydrated()) {
            setIsHydrated(true);
        }

        return unsub;
    }, []);

    if (!isHydrated) {
        return <div>Loading...</div>;
    }

    if (!user) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;
