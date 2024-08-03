"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";



export default function ResetPasswordPage() {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [reset, setReset] = React.useState({
        token: "",
        newpassword: "",
        confirmPassword: "",
    })

    const onUpdatePassword = async () => {
        setLoading(true);
        try {
            if(reset.newpassword !== reset.confirmPassword) {
                setError("Confirm password does not matching !")
                setLoading(false);
                return;
            }
            const response = await axios.post("/api/users/updatepassword", reset);
            const data = response.data; 
            if (data) {
                setLoading(false);
                toast.success('Password updated successful!');
                router.push("/login");
            }
        } catch (error: any) {
            setLoading(false)
            toast.error('Update password failed !');
            console.log("!! Error occured while updating password", error);
        }
    }

    

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setReset((prevReset: any) => ({ ...prevReset, token: urlToken }));
    }, []);

    useEffect(() => {
        setButtonDisabled(!reset.newpassword || !reset.confirmPassword);
    }, [reset.newpassword, reset.confirmPassword]);

    return (
        <div className="flex w-full h-screen items-center justify-center">
            <div className="flex flex-col justify-center items-center bg-gray-500/10 max-h-screen p-4">
                <h1 className="text-2xl">{loading ? "Processing.." : "Reset Password"}</h1>
                <p className="text-sm w-52 text-black bg-emerald-300 break-all">{reset.token}</p>

                <label htmlFor="password" className="w-full text-start text-sm text-gray-300 mb-1 mt-4">New Password</label>
                <input className="px-3 py-2 bg-transparent border border-gray-800" type="password" id="password" value={reset.newpassword} onChange={(e) => setReset({...reset, newpassword: e.target.value})} placeholder="Enter new password" />

                <label htmlFor="password" className="w-full text-start text-sm text-gray-300 mb-1 mt-4">Confirm New Password</label>
                <input className="px-3 py-2 bg-transparent border border-gray-800" type="password" id="confpassword" value={reset.confirmPassword} onChange={(e) => setReset({...reset, confirmPassword: e.target.value})} placeholder="Confirm new password" />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <button 
                    className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200" 
                    onClick={onUpdatePassword}
                    style={{cursor: `${buttonDisabled? "not-allowed": "pointer"}`, opacity: `${buttonDisabled? 0.5: 1}`}}
                >
                    Update password
                </button>
            </div>
            <Toaster />
        </div>
    )
}