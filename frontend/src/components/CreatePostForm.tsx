import React, { ChangeEvent, FormEvent, useState } from 'react'

function CreatePostForm() {
    const [form, setForm] = useState({ text: "" });

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
            console.log("user created", data);
        } catch (err) {
            console.log("Error", err);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="text" placeholder='Enter text' value={form.text} onChange={handleChange} required />
                <button type="submit">Create Post</button>
            </form>
        </>
    )
}

export default CreatePostForm
