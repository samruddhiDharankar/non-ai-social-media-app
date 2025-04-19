import { useEffect, useState } from "react";
import { User } from "../types/user";

function UserProfile() {
    const [userData, setUserData] = useState<User>();
    // call get/me api

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });
                const data = await response.json();
                console.log("user data", data);
                setUserData(data);
            } catch (err) {
                console.log("error", err);
            }
        }
        getUserData();
    }, []);

    return (
        <div>
            <p>hello user page</p>
        </div>
    )
}

export default UserProfile
