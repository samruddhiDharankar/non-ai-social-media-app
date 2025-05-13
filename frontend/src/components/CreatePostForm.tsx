'use client';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
const VITE_API_URL = import.meta.env.VITE_API_URL;
function CreatePostForm() {
    const [form, setForm] = useState({ text: "" });
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const token = localStorage.getItem("accessToken");

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${VITE_API_URL}/posts/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // credentials: "include", // required to include cookies
                body: JSON.stringify(form),
            });
            // const data = await response.json();
            if (response.ok) {
                setMessage("Post created successfully");
                setIsSuccess(true);
                setForm({ text: "" });

                // reset text area height
                if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                }
            }
            else {
                setMessage("Something went wrong. Please try again later");
                setIsSuccess(false)
            }
        } catch (err) {
            setMessage("Error creating post.");
            setIsSuccess(false);
        }
    }

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    })

    return (
        <div className="min-h-screen p-6 font-sans">
            <div className="post-card max-w-4xl mx-auto p-6 shadow-md rounded-md">
                <h1 className="heading-text text-2xl font-semibold text-center mb-6">Create a Post</h1>
                {message && (
                    <div className={`p-2 rounded-md text-sm mb-4 ${isSuccess
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>{message}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            ref={textareaRef}
                            name="text"
                            placeholder="Enter your post..."
                            value={form.text}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="create-post-box w-full resize-none p-3 rounded-md"
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md transition ${form.text.trim()
                            ? "send-button"
                            : "disable-button"
                            }`}
                        disabled={!form.text.trim()}
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePostForm;
