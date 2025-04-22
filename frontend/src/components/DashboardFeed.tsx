import { useEffect, useState } from 'react';
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/useAuthStore';

function DashboardRoute() {
    const navigate = useNavigate();
    const [feedData, setFeedData] = useState<Post[]>([]);
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        const getFeed = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/posts/feed", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });
                if (response.ok) {
                    const posts = await response.json();
                    setFeedData(posts);
                } else {
                    navigate("/");
                    useAuthStore.getState().logout();
                }

            } catch (err) {
                console.log("Error fetching posts", err);
            }
        };

        getFeed();
    }, []);

    const handleAddComment = async (postId: string) => {
        const comment = newComment[postId]?.trim();
        if (!comment) return;
        setCommentLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/comments/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ postId, content: comment }),
            });
            const data = await response.json();

            if (response.ok) {
                setNewComment((prev) => ({ ...prev, [postId]: "" }));  // Clear comment for only this post

                // Refresh comments for the post
                setFeedData(prevData =>
                    prevData.map(post =>
                        post._id === postId ? { ...post, comments: [...post.comments, data] } : post
                    )
                );
            } else {
                console.log("Failed to add comment");
            }
        } catch (err) {
            console.error("Error adding comment", err);
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-yellow-100 to-pink-100 min-h-screen p-6 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-extrabold text-pink-600 text-center mb-6">📌 Dashboard Feed</h1>

                {feedData.length > 0 ? (
                    feedData.map((post) => (
                        <div key={post._id} className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-pink-300">
                            <div className="mb-2">
                                <Link to={`/${post.user.username}`}>
                                    <p className="font-bold text-purple-600 hover:underline">@{post.user.username}</p>
                                </Link>
                                <p className="text-sm text-gray-400">{formatDateTime(post.createdAt)}</p>
                            </div>
                            <p className="text-lg text-gray-800">{post.text}</p>
                            <p className="text-sm text-purple-500 mt-1">{post.aiDetectionSummary}</p>

                            {/* Comments */}
                            <div className="mt-4">
                                <h4 className="text-md font-semibold text-gray-700">💬 Comments</h4>
                                <div className="space-y-2 mt-2">
                                    {post.comments?.length ? (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className="bg-gray-100 p-3 rounded-lg shadow-sm">
                                                <Link to={`/${comment.user.username}`}>
                                                    <p className="font-medium text-purple-700">@{comment.user.username}</p>
                                                </Link>
                                                <p className="text-sm text-gray-600">{comment.content}</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">No comments yet 💭</p>
                                    )}
                                </div>

                                {/* New Comment Input */}
                                <div className="mt-4 flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment[post._id] || ""}
                                        onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                                        className="flex-1 px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                                    />
                                    <button
                                        onClick={() => handleAddComment(post._id)}
                                        disabled={commentLoading}
                                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm shadow-md"
                                    > Send
                                        {/* {commentLoading ? '...' : 'Send'} */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-sm mt-10">No posts yet. Follow others to see their vibes! 🌟</p>
                )}
            </div>
        </div>
    );
}

export default DashboardRoute;
