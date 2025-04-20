import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

function CreatePostForm() {
    const [form, setForm] = useState({ text: "" });
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/posts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // required to include cookies
                body: JSON.stringify(form),
            });
            const data = await response.json();
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
                setMessage(data.message || "Something went wrong.");
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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-semibold text-center mb-6">Create a Post</h1>
            {message && (
                <div className={`p-2 rounded-md text-sm mb-4 ${isSuccess
                    ? 'bg-green-100 text-green-700'
                    : 'bg-res-100 text-red-700'
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
                        className="w-full resize-none p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    disabled={!form.text.trim()}
                >
                    Create Post
                </button>

            </form>
        </div>
    )
}

export default CreatePostForm
