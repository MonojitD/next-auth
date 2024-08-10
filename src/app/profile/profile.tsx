"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useAppSelector, useAppDispatch, useAppStore } from '@/lib/hooks/hooks';
import {increment, decrement, multiply, reset } from '@/lib/store/count/countSlice';

import Head from "next/head";




export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("")
    const router = useRouter();

    const count = useAppSelector((state) => state.count.value);
    const dispatch = useAppDispatch();

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

    // useEffect(() => {
    //   document.title = "Profile"
    // }, []);

  return (
    <>
    <Head>
      <title>Profile - page</title>
    </Head>
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

      <div className="flex flex-col items-center mt-5">
        <h2>Count</h2>
        <h1 className="text-4xl font-bold">{count}</h1>
        <div>
          <button className="bg-white mt-5 text-gray-900 text-md font-bold px-4 py-2 mx-2 hover:bg-gray-200"
          onClick={()=> dispatch(increment())}>
            +
          </button>
          <button className="bg-white mt-5 text-gray-900 text-md font-bold px-4 py-2 mx-2 hover:bg-gray-200"
          onClick={()=> dispatch(decrement())}>
            -
          </button>
          <button className="bg-white mt-5 text-gray-900 text-md font-bold px-4 py-2 mx-2 hover:bg-gray-200"
          onClick={()=> dispatch(multiply(2))}>
            *
          </button>
          <button className="bg-white mt-5 text-gray-900 text-md font-bold px-4 py-2 mx-2 hover:bg-gray-200"
          onClick={()=> dispatch(reset())}>
            &lt;-
          </button>
        </div>
      </div>
      <Toaster />
    </div>
    </>
  );
}
