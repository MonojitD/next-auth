"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("")
    const router = useRouter();

    const onLogout = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/users/logout");
            if(response.data) {
                setLoading(false);
                toast.success('Logout Successful!');
                console.log("Logout successfully", response.data);
                router.push("/login");
            }
        } catch (error: any) {
            setLoading(false)
            toast.error('Logout failed !');
            console.log("!! Error occured while logging out", error);
        }
    }

    const getUserDetails = async () => {
      console.log("here")
      const response = await axios.get("/api/users/me");  
      const all = response.data;
      console.log(all.data);
      setData(all.data._id);
    }

    // useEffect(() => {
    //   getUserDetails()
    // }, []);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>{loading? "Processing.." : "Profile Page"}</h1>
      <h1>{data === ""? "No data" : <Link className="underline" href={`/profile/${data }`}>{data}</Link>}</h1>
      <button
        className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200"
        onClick={onLogout}
      >
        Log out
      </button>
      <button
        className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200"
        onClick={getUserDetails}
      >
        Get details
      </button>
      <Toaster />
    </div>
  );
}
