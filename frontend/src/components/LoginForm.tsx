'use client';
import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/useAuthStore';
import GoogleLoginButton from './GoogleLoginButton';
const VITE_API_URL = import.meta.env.VITE_API_URL;
function LoginForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [isLoginFailed, setIsLoginFailed] = useState(false);
    const isFormValid = form.email && form.password;
    const setUser = useAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // credentials: "include", // required to include cookies
                body: JSON.stringify({ ...form, email: form.email.trim() }),
            });
            const data = await response.json();
            localStorage.setItem("accessToken", data.user.token);
            localStorage.setItem("refreshToken", data.user.refreshToken);
            if (response.ok) {
                console.log("Logged in");

                setUser({
                    userId: data.user._id,
                    username: data.user.username
                });
                setIsLoading(true);
                setTimeout(() => {

                    navigate("/dashboard");
                }, 50);
            }
            else {
                setIsLoginFailed(true);
            }

        } catch (err) {
            console.log("Error", err);
            setIsLoginFailed(true);
        }
    }


    return (
        <div className='flex flex-col gap-2'>
            <form className='space-y-3' onSubmit={handleSubmit} >
                <input
                    name="email"
                    placeholder='Email'
                    value={form.email}
                    onChange={handleChange}
                    required
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400'
                />
                <input
                    type="password"
                    name="password"
                    placeholder='password'
                    value={form.password}
                    onChange={handleChange}
                    required
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400'
                />
                <button
                    type='submit'
                    disabled={!isFormValid}
                    className={`w-full py-2 rounded-md transition ${isFormValid
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Log In
                </button>
                <GoogleLoginButton />
                {isLoading && (
                    <p className="text-center text-sm text-pink-800">Logging in...</p>
                )}
                {isLoginFailed && (
                    <p className="text-center text-sm text-pink-800">Email or password doesn't match</p>
                )}
            </form>

        </div>
    )
}

export default LoginForm
