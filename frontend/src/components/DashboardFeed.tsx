import { useEffect, useState } from 'react';
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';
import { Link } from 'react-router-dom';

function DashboardRoute() {
    const [feedData, setFeedData] = useState<Post[]>([]);
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
    const [commentLoading, setCommentLoading] = useState(false);

    // Fetch posts with username and comments
    useEffect(() => {
        // fetch post feed data
        const getFeed = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/posts/feed", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });
                const posts = await response.json();
                setFeedData(posts);
            } catch (err) {
                console.log("Error fetching posts", err);
            }
        };

        getFeed();
    }, []);

    // Handle adding a new comment
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
                {feedData.map((feed) => (
                    <div
                        key={feed._id}
                        className="p-4 bg-white shadow-md rounded-md border border-gray-200 hover:shadow-lg transition"
                    >
                        <p className="text-gray-800 mb-2">{feed.text}</p>
                        <p className="text-sm text-indigo-600 italic mb-2">
                            AI Summary: {feed.aiDetectionSummary}
                        </p>
                        <div className="text-sm text-gray-500 flex justify-between">
                            <span>Posted by
                                <Link to={`/${feed.user.username}`} >
                                    <span className="font-medium text-gray-700">
                                        {feed.user.username}
                                    </span>
                                </Link>
                            </span>
                            <span>{formatDateTime(feed.createdAt)}</span>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700">Comments</h3>
                            <div className="space-y-4 mt-2">
                                {feed.comments && feed.comments.length > 0 ? (
                                    feed.comments.map((comment) => (
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

                        <div className="mt-4">
                            <textarea
                                value={newComment[feed._id] || ""}
                                onChange={(e) => setNewComment((prev) => ({
                                    ...prev,
                                    [feed._id]: e.target.value,
                                }))}
                                placeholder="Write a comment..."
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                onClick={() => handleAddComment(feed._id)}
                                disabled={commentLoading}
                                className="mt-2 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {commentLoading ? 'Posting...' : "Post Comment"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardRoute;
