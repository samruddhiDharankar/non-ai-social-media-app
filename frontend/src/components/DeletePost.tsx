const VITE_API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("accessToken");

interface DeletePostProps {
    postId: string;
    onDelete?: () => void;
}

function DeletePost({ postId, onDelete }: DeletePostProps) {

    const handlePostDelete = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/posts/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Post deleted", data);
                if (onDelete) {
                    onDelete();
                }
            }
        } catch (err) {
            console.error("Error deleting post", err);
        }
    }

    return (
        <div>
            <button
                className="cursor-pointer text-xl text-gray-400 hover:text-red-600 focus:outline-none"
                onClick={handlePostDelete}
                title="Delete post"
            >🗑
            </button>
        </div>
    )
}

export default DeletePost
