import { useEffect, useState } from "react";
import { User } from "../types/user";
import { Post } from "../types/post";

function UserProfile() {
    const [userData, setUserData] = useState<User>();
    const [userPostData, setUserPostData] = useState<Post[]>([]);
    const [isUserData, setIsUserData] = useState(false);

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
                setIsUserData(true);
            } catch (err) {
                console.log("error", err);
                setIsUserData(false);
            }
        }

        const getPostsByUser = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/posts/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });
                const data = await response.json();
                console.log("user post data", data);
                setUserPostData(data);
            } catch (err) {
                console.log("error", err);
            }
        }
        getUserData();
        getPostsByUser();
    }, []);

    return (
        <div>
            <p>User Profile Page</p>
            {isUserData &&
                <div>
                    <p>Name: {userData?.name}</p>
                    <p>Username: {userData?.username}</p>
                    <p>Badge: {userData?.badge}</p>
                    <p>Post Count: {userData?.postCount}</p>
                    <p>Streak Count: {userData?.streakCount}</p>
                    <p>Tier: {userData?.tier}</p>
                </div>
            }
            <p>Posts</p>
            {userPostData.length > 0 &&
                <div>
                    {userPostData.map((post) => (
                        <div key={post._id}>

                            <p>{post?.text}</p>
                            <p>{post?.aiDetectionSummary}</p>
                            <p>{post?.createdAt}</p>
                            <p>.</p>
                        </div>
                    ))}
                </div>
            }

        </div>
    )
}

export default UserProfile
