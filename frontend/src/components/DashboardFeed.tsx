import { useEffect, useState } from 'react'
import { Post } from '../types/post';
import { formatDateTime } from '../utils/dateFormatter';

function DashboardRoute() {
    const [feedData, setFeedData] = useState<Post[]>([]);
    const [enrichedFeedData, setEnrichedFeedData] = useState<Post[]>([]);

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
                const data = await response.json();
                console.log("dashboard data ", data);
                setFeedData(data);
            } catch (err) {
                console.log("error", err);
            }
        }
        getFeed();
    }, []);

    useEffect(() => {
        const enrichFeedWithUserData = async () => {
            const updatedFeed = await Promise.all(feedData.map(async (post) => {
                try {
                    const response = await fetch(`http://localhost:3000/api/users/${post.userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                    });
                    const userData = await response.json();
                    return {
                        ...post,
                        username: userData.username ?? "Unknown",
                    }
                } catch (err) {
                    console.error("Error fetching user data", err);
                    return {
                        ...post,
                        username: "Unknown",
                    }
                }
            }));
            setEnrichedFeedData(updatedFeed);
        };

        if (feedData.length > 0) {
            enrichFeedWithUserData();
        }
    }, [feedData]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* <h1 className="text-2xl font-semibold text-center mb-6">Dashboard Feed</h1> */}

            <div className="space-y-6">
                {enrichedFeedData.map((feed) => (
                    <div
                        key={feed._id}
                        className="p-4 bg-white shadow-md rounded-md border border-gray-200 hover:shadow-lg transition"
                    >
                        <p className="text-gray-800 mb-2">{feed.text}</p>
                        <p className="text-sm text-indigo-600 italic mb-2">
                            AI Summary: {feed.aiDetectionSummary}
                        </p>
                        <div className="text-sm text-gray-500 flex justify-between">
                            <span>Posted by <span className="font-medium text-gray-700">{feed.username}</span></span>
                            <span>{formatDateTime(feed.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardRoute
