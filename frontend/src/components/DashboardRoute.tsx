import React, { useEffect } from 'react'

function DashboardRoute() {
    useEffect(() => {
        console.log("inside dash");
        const getFeed = async () => {
            try {
                console.log("inside dash try");
                const response = await fetch("http://localhost:3000/api/posts/feed", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });
                const data = await response.json();
                console.log("dashboard data ", data);
                console.log("okay");
            } catch (err) {
                console.log("error", err);
            }
        }
        getFeed();
    }, []);

    return (
        <>
            <p>Hello world</p>
        </>
    )
}

export default DashboardRoute
