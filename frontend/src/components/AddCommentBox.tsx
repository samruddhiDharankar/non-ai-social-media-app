import { useState } from "react"
const VITE_API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("accessToken");

interface AddCommentBoxProps {
    postId: string;
    onCommentAdded: (comment: any) => void;
}

function AddCommentBox({ postId, onCommentAdded }: AddCommentBoxProps) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddComment = async () => {
        const trimmedComment = comment.trim();
        if (!trimmedComment) return;
        setLoading(true);
        try {
            const response = await fetch(`${VITE_API_URL}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ postId, content: trimmedComment }),
            });
            const data = await response.json();
            if (response.ok) {
                setComment("");
                onCommentAdded(data);
            } else {
                console.error("Failed to add comment");
            }
        } catch (err) {
            console.error("Error adding comment", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 flex items-center gap-2">
            <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-box flex-1 px-4 py-2 text-sm"
            />
            <button
                onClick={handleAddComment}
                disabled={loading}
                className="send-button px-4 py-2 rounded-full text-sm shadow-md"
            > Send
            </button>
        </div>
    )
}

export default AddCommentBox
