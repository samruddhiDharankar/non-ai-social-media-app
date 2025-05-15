'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User } from '../types/user';
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';
import { useAuthStore } from '../utils/useAuthStore';
import { Follow } from '../types/follow';
import TierAndPerksInfo from './TierAndPerksInfo';
import TierChange from './TierChange';
import AddCommentBox from './AddCommentBox';
const VITE_API_URL = import.meta.env.VITE_API_URL;

function UserPublicProfile() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [userData, setUserData] = useState<User>();
    const [userPostData, setUserPostData] = useState<Post[]>([]);
    const [followers, setFollowers] = useState<Follow[]>([]);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    // const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState<Follow[]>([]);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [prevUserId, setPrevUserId] = useState("");
    const [disableFollowButtons, setDisableFollowButtons] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const LIMIT = 10;

    const [showTierInfoModal, setShowTierInfoModal] = useState(false);
    const [isTierChange, setIsTierChange] = useState(0);

    const token = localStorage.getItem("accessToken");

    const closeTierInfoModal = () => {
        setShowTierInfoModal(false);
    }

    const fetchUserPosts = async (pageNumber: number) => {
        try {
            if (userData) {
                const postResponse = await fetch(`${VITE_API_URL}/posts/user/${userData._id}?page=${pageNumber}&limit=${LIMIT}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`

                    },
                    // credentials: "include",
                });

                if (postResponse.ok) {
                    const postData = await postResponse.json();
                    if (userData?._id === prevUserId) {
                        setUserPostData(prev => [...prev, ...postData.posts]);

                    }
                    else {
                        setUserPostData(postData.posts);
                        setPrevUserId(userData?._id);

                    }
                    setHasMore(pageNumber < postData.totalPages);

                } else {
                    navigate("/");
                    useAuthStore.getState().logout();
                }
            }
        } catch (err) {
            console.log("error fetching posts", err);
        }
    }

    useEffect(() => {
        if (!userData?._id) return;
        fetchUserPosts(page);
    }, [userData?._id, page]);

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let userResponse;
                if (username) {
                    userResponse = await fetch(`${VITE_API_URL}/users/username/${username}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        // credentials: "include",
                    });
                    if (username === useAuthStore.getState().user?.username) {
                        setDisableFollowButtons(true);
                    }
                    else {
                        setDisableFollowButtons(false);
                    }
                } else {
                    userResponse = await fetch(`${VITE_API_URL}/users/me`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        // credentials: "include",
                    });
                    setDisableFollowButtons(true);
                }

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setUserData(userData);
                    setPage(1);
                    if (userData.isTierChanged != 0) {
                        setIsTierChange(userData.isTierChanged);
                    }

                    try {
                        const response = await fetch(`${VITE_API_URL}/followers?userId=${userData?._id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            // credentials: "include",
                        });
                        if (response.ok) {
                            const data = await response.json();

                            setIsFollowing(data.some((item: any) => item.follower._id === useAuthStore.getState().user?.userId));
                            setFollowers(data);
                        }
                    } catch (err) {
                        console.log(err);
                    }

                } else {
                    navigate("/");
                    useAuthStore.getState().logout();
                }
                // setLoading(false);
            } catch (err) {
                console.error("Error fetching user & posts", err);
            }
        };

        fetchUser();
    }, [username]);

    const handleFollow = async () => {
        try {
            await fetch(`${VITE_API_URL}/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // credentials: "include",
                body: JSON.stringify({ targetUserId: userData?._id })
            });
            // const data = await response.json();
            setIsFollowing(true);
            // setFollowers(prev => [...prev, { follower: useAuthStore.getState().user }]);
        } catch (err) {
            console.log("error in following", err);
        }
    }

    const handleUnfollow = async () => {
        try {
            await fetch(`${VITE_API_URL}/unfollow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // credentials: "include",
                body: JSON.stringify({ targetUserId: userData?._id })
            });
            // const data = await response.json();
            setIsFollowing(false);
        } catch (err) {
            console.log("Error unfollowing", err);
        }
    }

    const handleFetchFollowersButton = async () => {
        setShowFollowerModal(true);
    }

    const fetchFollowing = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/following?userId=${userData?._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // credentials: "include",
            });
            const data = await response.json();
            setFollowing(data);
            setShowFollowingModal(true);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen p-6 font-sans">

            {isTierChange !== 0 && (
                <>
                    <TierChange tierChangeValue={isTierChange} />
                </>
            )}

            {/* User Detail Box */}
            <div className="post-card max-w-3xl mx-auto shadow-xl rounded-3xl p-6 space-y-4">

                {/* Change this */}
                <h1 className="primary-text text-xl sm:text-2xl md:text-3xl font-extrabold mb-7 text-center break-words px-4">{userData?.username}</h1>

                <div className="space-y-2">
                    <p><span className="primary-text font-bold">Name:</span><span className='secondary-text'> {userData?.name}</span></p>
                    <p><span className="primary-text font-bold">Badge:</span><span className='secondary-text'> {userData?.badge}</span></p>
                    <p><span className="primary-text font-bold">Posts:</span><span className='secondary-text'> {userData?.postCount}</span></p>
                    <p><span className="primary-text font-bold">Streak:</span><span className='secondary-text'> {userData?.streakCount}</span></p>
                    <p>
                        <span className="primary-text font-bold">Tier:</span><span className='secondary-text'> {userData?.tier}</span>
                        <button onClick={() => setShowTierInfoModal(true)}
                            className='cursor-pointer'
                            title='View Tier Info'
                        >ℹ️</button>
                    </p>
                </div>
                {showTierInfoModal && (
                    <TierAndPerksInfo isVisible={showTierInfoModal} closeModal={closeTierInfoModal} />
                )}

                <div className="flex gap-4 mt-4 justify-center flex-wrap">
                    {!disableFollowButtons && (
                        <>
                            {isFollowing ? (
                                <button onClick={handleUnfollow} className="send-button py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                                    Unfollow
                                </button>
                            ) : (
                                <button onClick={handleFollow}
                                    className="send-button py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                                    Follow
                                </button>
                            )}
                        </>
                    )}

                    <button onClick={handleFetchFollowersButton}
                        className="secondary-button py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                        View Followers
                    </button>
                    <button onClick={fetchFollowing}
                        className="secondary-button py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
                        View Following
                    </button>

                </div>
            </div>

            {/* Follower Modal */}
            {showFollowerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    {/* Floating shapes */}
                    <div className="absolute inset-0 pointer-events-none animate-pulse opacity-30">
                        <div className="absolute top-10 left-10 w-4 h-4 rounded-full blur-md"></div>
                        <div className="absolute top-1/2 right-12 w-6 h-6 rounded-full blur-sm"></div>
                        <div className="absolute bottom-10 left-1/3 w-3 h-3 bg rounded-full blur-md"></div>
                    </div>

                    <div className="navbar-background relative w-[90%] max-w-md rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setShowFollowerModal(false)}
                            className="absolute top-3 right-3 text-lg text-gray-400 hover:text-pink-600 transition cursor-pointer"
                        >
                            ✖
                        </button>
                        <h3 className="primary-text text-2xl font-bold text-center mb-4">Followers</h3>

                        <div className="max-h-[300px] overflow-y-auto space-y-3">
                            {followers.length > 0 ? (
                                followers.map((f) => (
                                    <Link key={f._id} to={`/${f.follower.username}`} onClick={() => setShowFollowerModal(false)}>
                                        <div className="create-post-box p-4 mb-2 rounded-xl shadow cursor-pointer ">
                                            <p className="primary-text">{f.follower.name}</p>
                                            <p className="tertiary-text text-sm">@{f.follower.username}</p>
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

            {/* Following Modal */}
            {showFollowingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    {/* Floating shapes */}
                    <div className="absolute inset-0 pointer-events-none animate-pulse opacity-30">
                        <div className="absolute top-10 left-10 w-4 h-4 rounded-full blur-md"></div>
                        <div className="absolute top-1/2 right-12 w-6 h-6 rounded-full blur-sm"></div>
                        <div className="absolute bottom-10 left-1/3 w-3 h-3 rounded-full blur-md"></div>
                    </div>

                    <div className="navbar-background relative w-[90%] max-w-md rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setShowFollowingModal(false)}
                            className="absolute top-3 right-3 text-lg text-gray-400 hover:text-pink-600 transition cursor-pointer"
                        >
                            ✖
                        </button>
                        <h3 className="primary-text text-2xl font-bold text-center mb-4">Following</h3>

                        <div className="max-h-[300px] overflow-y-auto space-y-3">
                            {following.length > 0 ? (
                                following.map((f) => (
                                    <Link key={f._id} to={`/${f.following.username}`} onClick={() => setShowFollowingModal(false)}>
                                        <div className="create-post-box p-4 mb-2 rounded-xl shadow cursor-pointer ">
                                            <p className="primary-text">{f.following.name}</p>
                                            <p className="tertiary-text text-sm">@{f.following.username}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">Not following anyone yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Posts */}
            <div className="max-w-3xl mx-auto mt-10 space-y-6">
                <h2 className="primary-text text-2xl font-bold text-center">Posts</h2>

                {userPostData && userPostData.length > 0 ? (
                    userPostData.map((post) => (
                        <div key={post._id} className="post-card p-5 rounded-2xl shadow-lg">
                            <p className="secondary-text text-lg">{post?.text}</p>
                            <p className="primary-text text-sm mt-1">{post?.aiDetectionSummary}</p>
                            <p className="tertiary-text text-xs">{formatDateTime(post?.createdAt)}</p>

                            <div className="mt-3">
                                <h4 className="secondary-text text-md font-semibold">💬 Comments</h4>
                                <div className="space-y-2 mt-2">
                                    {post.comments?.length ? (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className="comment-card p-3 rounded-lg shadow-sm">
                                                <Link to={`/${comment.user.username}`}>
                                                    <p className="primary-text font-medium">@{comment.user?.username}</p>
                                                </Link>
                                                <p className="secondary-text text-sm">{comment.content}</p>
                                                <p className="tertiary-text text-xs">{formatDateTime(comment.createdAt)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="tertiary-text text-sm">No comments yet 💭</p>
                                    )}
                                </div>
                                {/* New Comment Input */}
                                <AddCommentBox
                                    postId={post._id}
                                    onCommentAdded={(newComment: any) => {
                                        setUserPostData((prevData) =>
                                            prevData.map((p) =>
                                                p._id === post._id
                                                    ? { ...p, comments: [...p.comments, newComment] }
                                                    : p
                                            )
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="tertiary-text text-center text-sm mt-4">No posts yet. Time to write something magical! ✨</p>
                )}

                {/* Infinite scroll loader */}
                <div ref={loaderRef} className="secondary-text text-center mt-6">
                    {hasMore ? "Loading more..." : "No more posts"}
                </div>
            </div>
        </div >

    );
}

export default UserPublicProfile;
