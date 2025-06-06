'use client';
import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const VITE_API_URL = import.meta.env.VITE_API_URL;
function SignupForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        // username: "",
        email: "",
        password: "",
    });

    const [isSignupFailed, setIsSignupFailed] = useState(false);
    const [signupErrorMessage, setSignupErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isFormValid = form.name.trim() && form.email.trim() && form.password.trim();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${VITE_API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // credentials: "include", // required to include cookies
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (response.ok) {
                setIsLoading(true);
                navigate("/");  // navigates to login
            }
            else {
                setSignupErrorMessage(data.message);
                setIsSignupFailed(true);
            }
        } catch (err) {
            setSignupErrorMessage("Signup failed");
            setIsSignupFailed(true);
        }
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
                {/* <input
                    name="username"
                    placeholder='Username'
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                /> */}
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
                {isLoading && (
                    <p className="text-center text-sm text-pink-800">Signing up...</p>
                )}
                {isSignupFailed && (
                    <p className="text-center text-sm text-pink-800">{signupErrorMessage}</p>
                )}
            </form>
        </>
    )
}

export default SignupForm
