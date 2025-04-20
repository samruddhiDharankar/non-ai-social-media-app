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
        <>
            <div className='bg-[#E5E7EB]'>
                {enrichedFeedData.map((feed) => (
                    <div key={feed._id}>
                        <p>{feed.text}</p>
                        <p>{feed.aiDetectionSummary}</p>
                        <p>{formatDateTime(feed.createdAt)}</p>
                        <p>{feed.username}</p>
                        <p>.</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default DashboardRoute
