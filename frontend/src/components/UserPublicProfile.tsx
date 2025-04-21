import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User } from '../types/user';
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';

function UserPublicProfile() {
    const { username } = useParams();
    const [userData, setUserData] = useState<User>();
    const [userPostData, setUserPostData] = useState<Post[]>([]);
    const [followers, setFollowers] = useState([]);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            try {
                let userResponse;
                if (username) {
                    userResponse = await fetch(`http://localhost:3000/api/users/username/${username}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                } else {
                    userResponse = await fetch(`http://localhost:3000/api/users/me`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                }

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setUserData(userData);

                    const postResponse = await fetch(`http://localhost:3000/api/posts/user/${userData._id}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                    const postData = await postResponse.json();
                    setUserPostData(postData);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user & posts", err);
            }
        };

        fetchUserAndPosts();
    }, [username]);

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/follow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ targetUserId: userData?._id })
            });
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.log("error in following", err);
        }
    }

    const fetchFollowers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/followers?userId=${userData?._id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await response.json();
            console.log(data);
            setFollowers(data);
            setShowFollowerModal(true);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="bg-gradient-to-br from-yellow-100 to-pink-100 min-h-screen p-6 font-sans">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 space-y-4 border-2 border-pink-300">

                <h1 className="text-3xl font-extrabold text-pink-600 mb-7 text-center">👩‍💻 {userData?.username}</h1>

                <div className="space-y-2 text- text-gray-800">
                    <p><span className="font-bold text-purple-600">Name:</span> {userData?.name}</p>
                    <p><span className="font-bold text-purple-600">Badge:</span> {userData?.badge}</p>
                    <p><span className="font-bold text-purple-600">Posts:</span> {userData?.postCount}</p>
                    <p><span className="font-bold text-purple-600">Streak:</span> {userData?.streakCount}</p>
                    <p><span className="font-bold text-purple-600">Tier:</span> {userData?.tier}</p>
                </div>

                <div className="flex gap-4 mt-4 justify-center">
                    <button onClick={handleFollow}
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                        ➕ Follow
                    </button>
                    <button onClick={fetchFollowers}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                        🙋 View Followers
                    </button>
                </div>
            </div>

            {/* Follower Modal */}
            {showFollowerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-200/60 via-yellow-100/60 to-purple-200/60 backdrop-blur-md">
                    {/* Floating shapes */}
                    <div className="absolute inset-0 pointer-events-none animate-pulse opacity-30">
                        <div className="absolute top-10 left-10 w-4 h-4 bg-pink-300 rounded-full blur-md"></div>
                        <div className="absolute top-1/2 right-12 w-6 h-6 bg-yellow-300 rounded-full blur-sm"></div>
                        <div className="absolute bottom-10 left-1/3 w-3 h-3 bg-purple-300 rounded-full blur-md"></div>
                    </div>

                    <div className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setShowFollowerModal(false)}
                            className="absolute top-3 right-3 text-lg text-gray-400 hover:text-pink-600 transition"
                        >
                            ✖
                        </button>
                        <h3 className="text-2xl font-bold text-center text-pink-600 mb-4">Followers</h3>

                        <div className="max-h-[300px] overflow-y-auto space-y-3">
                            {followers.length > 0 ? (
                                followers.map((f) => (
                                    <Link key={f._id} to={`/${f.follower.username}`} onClick={() => setShowFollowerModal(false)}>
                                        <div className="p-4 mb-2 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-xl shadow cursor-pointer ">
                                            <p className="font-bold text-gray-800">{f.follower.name}</p>
                                            <p className="text-sm text-gray-500">@{f.follower.username}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No followers yet. Be the first!</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Posts */}
            <div className="max-w-3xl mx-auto mt-10 space-y-6">
                <h2 className="text-2xl font-bold text-center text-purple-600">📝 Posts</h2>

                {userPostData && userPostData.length > 0 ? (
                    userPostData.map((post) => (
                        <div key={post._id} className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-pink-300">
                            <p className="text-gray-700 text-lg">{post?.text}</p>
                            <p className="text-sm text-purple-500 mt-1">{post?.aiDetectionSummary}</p>
                            <p className="text-xs text-gray-400">{formatDateTime(post?.createdAt)}</p>

                            <div className="mt-3">
                                <h4 className="text-md font-semibold text-gray-700">💬 Comments</h4>
                                <div className="space-y-2 mt-2">
                                    {post.comments?.length ? (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className="bg-gray-100 p-3 rounded-lg shadow-sm">
                                                <Link to={`/${comment.user.username}`}>
                                                    <p className="font-medium text-purple-700">@{comment.user?.username}</p>
                                                </Link>
                                                <p className="text-sm text-gray-600">{comment.content}</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No comments yet 💭</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500 mt-4">No posts yet. Time to write something magical! ✨</p>
                )}
            </div>
        </div>

    );
}

export default UserPublicProfile;
