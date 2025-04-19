import { ChangeEvent, FormEvent, useState } from 'react'

function SignupForm() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/auth/signup", {
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

        console.log("Signed up", form);
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder='Full name' value={form.name} onChange={handleChange} required />
                <input name="username" placeholder='Username' value={form.username} onChange={handleChange} required />
                <input name="email" placeholder='Email' value={form.email} onChange={handleChange} required />
                <input name="password" placeholder='Password' value={form.password} onChange={handleChange} required />
                <button type='submit'>Sign Up</button>
            </form>
        </>
    )
}

export default SignupForm
