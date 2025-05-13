'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/useAuthStore';
import TierAndPerksInfo from './TierAndPerksInfo';
const VITE_API_URL = import.meta.env.VITE_API_URL;
function DashboardRoute() {
    const navigate = useNavigate();
    const [feedData, setFeedData] = useState<Post[]>([]);
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
    const [commentLoading, setCommentLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const LIMIT = 10;
    const isInitialLoad = useRef(true);
    const [showTierInfoModal, setShowTierInfoModal] = useState(false);
    const { tierInfoSeen, setTierInfoSeen } = useAuthStore();
    const token = localStorage.getItem("accessToken");

    const fetchFeed = async (pageNumber: number) => {
        try {
            const response = await fetch(`${VITE_API_URL}/posts/feed?page=${pageNumber}&limit=${LIMIT}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
                // credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                // setFeedData(prev => [...prev, ...data.posts]);
                setFeedData(prev => {
                    const existingIds = new Set(prev.map(p => p._id));      // to avoid duplicates
                    const uniqueNewPosts = data.posts.filter((p: { _id: string; }) => !existingIds.has(p._id));
                    return [...prev, ...uniqueNewPosts];
                });

                setHasMore(pageNumber < data.totalPages);
            } else {
                navigate("/");
                useAuthStore.getState().logout();
                console.log("Logout triggered:");
            }
        } catch (err) {
            console.log("error fetching posts", err);
        }
    }

    // fetch feed first time
    useEffect(() => {

        fetchFeed(1);
        if (!tierInfoSeen) {
            setShowTierInfoModal(true);
        }
        isInitialLoad.current = false;
    }, []);

    // fetch feed when page changes (for infinite scrolling)
    useEffect(() => {
        if (isInitialLoad.current) {

            fetchFeed(page);    // fetch when page changes
        }

    }, [page]);

    const closeTierInfoModal = () => {
        setShowTierInfoModal(false);
        setTierInfoSeen();
    }

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];

        if (target.isIntersecting && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [handleObserver]);


    const handleAddComment = async (postId: string) => {
        const comment = newComment[postId]?.trim();
        if (!comment) return;
        setCommentLoading(true);

        try {
            const response = await fetch(`${VITE_API_URL}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                // credentials: 'include',
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
        <div className="min-h-screen p-6 font-sans">
            {showTierInfoModal && (
                <TierAndPerksInfo isVisible={showTierInfoModal} closeModal={closeTierInfoModal} />
            )}
            <div className="max-w-3xl mx-auto space-y-6">

                {/* <h1 className="text-3xl font-extrabold text-pink-600 text-center mb-6">📌 Dashboard Feed</h1> */}
                {feedData.length > 0 ? (
                    feedData.map((post) => (
                        <div key={post._id} className="post-card p-5 rounded-2xl shadow-lg">
                            <div className="mb-2">
                                <Link to={`/${post.user.username}`}>
                                    <p className="primary-text font-bold hover:underline">@{post.user.username}</p>
                                </Link>
                                <p className="tertiary-text text-sm">{formatDateTime(post.createdAt)}</p>
                            </div>
                            <p className="secondary-text text-lg">{post.text}</p>
                            <p className="primary-text text-sm mt-1">{post.aiDetectionSummary}</p>

                            {/* Comments */}
                            <div className="mt-4">
                                <h4 className="secondary-text text-md font-semibold">💬 Comments</h4>
                                <div className="space-y-2 mt-2">
                                    {post.comments?.length ? (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className="comment-card p-3 rounded-lg shadow-sm">
                                                <Link to={`/${comment.user.username}`}>
                                                    <p className="primary-text text-sm">{comment.user.username}</p>
                                                </Link>
                                                <p className="secondary-text text-sm">{comment.content}</p>
                                                <p className="tertiary-text text-xs">{formatDateTime(comment.createdAt)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="tertiary-text text-sm">No comments yet</p>
                                    )}
                                </div>

                                {/* New Comment Input */}
                                <div className="mt-4 flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment[post._id] || ""}
                                        onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                                        className="input-box flex-1 px-4 py-2 text-sm"
                                    />
                                    <button
                                        onClick={() => handleAddComment(post._id)}
                                        disabled={commentLoading}
                                        className="send-button px-4 py-2 rounded-full text-sm shadow-md"
                                    > Send
                                        {/* {commentLoading ? '...' : 'Send'} */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="secondary-text text-center text-sm mt-10">No posts yet. Follow others to see their vibes! 🌟</p>
                )}

                {/* Infinite scroll loader */}
                {hasMore && <div ref={loaderRef} className='h-10' />}

            </div>
        </div>
    );
}

export default DashboardRoute;
