"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";



export default function SignupPage() {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })

    const validateEmail = (email: any) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const onSignup = async () => {
        setLoading(true);
        try {
           const response = await axios.post("/api/users/signup", user);
           const data = await response.data; 
           if(data) {
               setLoading(false)
               toast.success('Signup Successful!');
               console.log("Signup successfully", data);
            }
            router.push("/login");
        } catch (error: any) {
            setLoading(false)
            toast.error('Signup failed !');
            console.log("!! Error occured while signing up", error);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.username.length > 0 && user.password.length > 0 ) {
            setButtonDisabled(false);
            if (validateEmail(user.email)) {
                setButtonDisabled(false);
                setError('');
            } else {
                setButtonDisabled(true);
                setError('Invalid email address');
            }
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div className="flex w-full h-screen items-center justify-center">
            <div className="flex flex-col justify-center items-center bg-gray-500/10 max-h-screen p-4">
                <h1 className="text-2xl">{loading ? "Processing.." : "Signup"}</h1>

                <label htmlFor="username" className="w-full text-start text-sm text-gray-300 mb-1 mt-4">Username</label>
                <input className="px-3 py-2 bg-transparent border border-gray-800" type="text" id="username" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} placeholder="Enter fullname" />

                <label htmlFor="email" className="w-full text-start text-sm text-gray-300 mb-1 mt-4">Email</label>
                <input className="px-3 py-2 bg-transparent border border-gray-800" type="email" id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} placeholder="Enter email" />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <label htmlFor="password" className="w-full text-start text-sm text-gray-300 mb-1 mt-4">Password</label>
                <input className="px-3 py-2 bg-transparent border border-gray-800" type="password" id="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} placeholder="Enter password" />

                <button 
                    className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200" 
                    onClick={onSignup}
                    style={{cursor: `${buttonDisabled? "not-allowed": "pointer"}`, opacity: `${buttonDisabled? 0.5: 1}`}}
                >
                    Signup here
                </button>

                <p className="text-[0.85rem] text-gray-400 mt-5">Already have an account? <Link href="/login" className="text-gray-300 hover:text-white">Login here</Link></p>
            </div>
            <Toaster />
        </div>
    )
}