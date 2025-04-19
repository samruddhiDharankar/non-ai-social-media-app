import { ChangeEvent, FormEvent, useState } from 'react'

function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // required to include cookies
                body: JSON.stringify(form),
            });
            const data = await response.json();
            console.log("token", data.token);
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Logged in", form);
    }

    return (
        <>
            <form onSubmit={handleSubmit} >
                <input name="email" placeholder='Email' value={form.email} onChange={handleChange} required />
                <input name="password" placeholder='password' value={form.password} onChange={handleChange} required />
                <button type='submit'>Log In</button>
            </form>
        </>
    )
}

export default LoginForm
