import { useEffect, useState } from "react";
import { User } from "../types/user";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/dateFormatter";

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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>

            {isUserData && (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-300">
                        <p className="text-lg font-medium">Name: <span className="text-indigo-600">{userData?.name}</span></p>
                        <p className="text-lg font-medium">Username: <span className="text-indigo-600">{userData?.username}</span></p>
                        <p className="text-lg font-medium">Badge: <span className="text-indigo-600">{userData?.badge}</span></p>
                        <p className="text-lg font-medium">Post Count: <span className="text-indigo-600">{userData?.postCount}</span></p>
                        <p className="text-lg font-medium">Streak Count: <span className="text-indigo-600">{userData?.streakCount}</span></p>
                        <p className="text-lg font-medium">Tier: <span className="text-indigo-600">{userData?.tier}</span></p>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Posts</h2>
                {userPostData.length > 0 ? (
                    <div className="space-y-4 mt-4">
                        {userPostData.map((post) => (
                            <div key={post._id} className="bg-gray-50 p-4 rounded-md border border-gray-300">
                                <p className="text-lg">{post?.text}</p>
                                <p className="text-sm text-indigo-600">{post?.aiDetectionSummary}</p>
                                <p className="text-sm text-gray-400">{formatDateTime(post?.createdAt)}</p>

                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold text-gray-700">Comments</h3>
                                    <div className="space-y-4 mt-2">
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((comment) => (
                                                <div key={comment._id} className="p-2 bg-gray-100 rounded-md shadow-sm">
                                                    <p className="text-sm font-medium text-gray-800">{comment.user?.username}</p>
                                                    <p className="text-sm text-gray-600">{comment.content}</p>
                                                    <span className="text-sm text-gray-500">
                                                        {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                                                            ? formatDateTime(comment.createdAt)
                                                            : "Just now"
                                                        }
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No comments yet</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500">No posts available</p>
                )}
            </div>
        </div>
    )
}

export default UserProfile
