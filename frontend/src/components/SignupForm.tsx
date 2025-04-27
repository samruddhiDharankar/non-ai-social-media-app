/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const VITE_API_URL = import.meta.env.VITE_API_URL;
function SignupForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [isSignupFailed, setIsSignupFailed] = useState(false);

    const isFormValid = form.name.trim() && form.username.trim() && form.email.trim() && form.password.trim();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${VITE_API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // required to include cookies
                body: JSON.stringify(form),
            });
            // const data = await response.json();

            if (response.ok) {
                console.log("Signed up");
                navigate("/");  // navigates to login
            }
            else {
                setIsSignupFailed(true);
            }
        } catch (err) {
            console.log("Error", err);
            setIsSignupFailed(true);
        }

        console.log("Signed up", form);
    }

    return (
        <>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder='Full name'
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                    name="username"
                    placeholder='Username'
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                    name="email"
                    placeholder='Email'
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                    type="password"
                    name="password"
                    placeholder='Password'
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                    type='submit'
                    disabled={!isFormValid}
                    className={`w-full py-2 rounded-md transition ${isFormValid
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Sign Up
                </button>
                {isSignupFailed && (
                    <p className="text-center text-sm text-pink-800">Sign up failed</p>
                )}
            </form>
        </>
    )
}

export default SignupForm
