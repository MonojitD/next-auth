"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserProfile({params}: any) {
    const [data, setData] = useState({
        username: "",
        email: "",
    })

    const getUserDetails = async () => {
        console.log("here")
        const response = await axios.get("/api/users/me");  
        const userData = response?.data?.data;
        setData((prevState)=> ({...prevState, email: userData.email, username: userData.username}));
      }
  
      useEffect(() => {
        getUserDetails()
      }, []);
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1>Profile Id : {params.id}</h1>
            <h1>Profile Name : {data.username}</h1>
            <h1>Profile Email : {data.email}</h1>
            <Link className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200" href="/">Back to home</Link>
        </div>
    )
}