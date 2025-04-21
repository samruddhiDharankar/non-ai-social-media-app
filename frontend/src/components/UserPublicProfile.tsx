import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { User } from '../types/user';
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';

function UserPublicProfile() {
    const { username } = useParams();
    const [userData, setUserData] = useState<User>();
    const [userPostData, setUserPostData] = useState<Post[]>([]);
    const [followers, setFollowers] = useState([]);
    const [showFollowerModal, setShowFollowerModal] = useState(false);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            try {
                let userResponse;
                if (username) {
                    // Fetch other user's data
                    userResponse = await fetch(`http://localhost:3000/api/users/username/${username}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                } else {
                    // Fetch current logged-in user's data
                    userResponse = await fetch(`http://localhost:3000/api/users/me`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                }

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setUserData(userData);

                    // Then fetch their posts
                    const postResponse = await fetch(`http://localhost:3000/api/posts/user/${userData._id}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                    const postData = await postResponse.json();
                    setUserPostData(postData);
                }
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
        <>
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-300">
                    <p className="text-lg font-medium">Name: <span className="text-indigo-600">{userData?.name}</span></p>
                    <p className="text-lg font-medium">Username: <span className="text-indigo-600">{userData?.username}</span></p>
                    <p className="text-lg font-medium">Badge: <span className="text-indigo-600">{userData?.badge}</span></p>
                    <p className="text-lg font-medium">Post Count: <span className="text-indigo-600">{userData?.postCount}</span></p>
                    <p className="text-lg font-medium">Streak Count: <span className="text-indigo-600">{userData?.streakCount}</span></p>
                    <p className="text-lg font-medium">Tier: <span className="text-indigo-600">{userData?.tier}</span></p>
                    <button onClick={handleFollow} className="mt-2 w-20 p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Follow</button>
                    <button onClick={fetchFollowers} className="text-blue-600 underline">Followers</button>

                    {showFollowerModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg w-80 max-h-[80vh] overflow-y-auto">
                                <h3 className="text-lg font-bold mb-4">Followers</h3>
                                <button className="absolute top-2 right-3 text-gray-500" onClick={() => setShowFollowerModal(false)}>X</button>

                                {followers.length > 0 ? (
                                    followers.map((f) => (
                                        <Link to={`/${f.follower.username}`} key={f._id}>
                                            <div className='p-2 border-b hover:bg-gray-100 cursor-pointer'>
                                                <p className='font-medium'>{f.follower.name}</p>
                                                <p className='text-sm text-gray-600'>@{f.follower.username}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className='text-sm text-gray-500'>No followers yet</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Posts</h2>
                {userPostData && userPostData.length > 0 ? (
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
                                                    <Link to={`/${comment.user.username}`}>
                                                        <p className="text-sm font-medium text-gray-800">{comment.user?.username}</p>
                                                    </Link>
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
        </>
    )
}

export default UserPublicProfile
