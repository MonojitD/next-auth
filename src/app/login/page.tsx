"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSend, setEmailSend] = useState("");
  const [forgot, setForgot] = useState(false);
  const [jumpModal, setJumpModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [verify, setVerify] = React.useState({
    email: "",
  });

  const validateEmail = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", user);
      const data = await response.data;
      if (data) {
        setLoading(false);
        toast.success("Login Successful!");
        console.log("Login successfully", data);
      }
      router.push("/profile");
    } catch (error: any) {
      setLoading(false);
      toast.error("Login failed !");
      console.log("!! Error occured while logging in", error);
    }
  };

  const onVerifyEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/forgotpassword", verify);
      const data = await response.data;
      if (data) {
        setLoading(false);
        setEmailSend(data.message);
        toast.success("Email send successfully");
        console.log("Email send successfully", data);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("Error sending email !");
      console.log("!! Error occured while verifying email", error);
    }
  };

  const onSearch = () => {
    let formattedSearchWord = searchWord
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('+');

      const url = `https://1337x.to/sort-search/${formattedSearchWord}/seeders/desc/1`;
      // const url = `https://www.google.com/search?q=${formattedSearchWord}`;
      window.open(url, '_blank');
    
    console.log(formattedSearchWord);
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
      if (validateEmail(user.email)) {
        setButtonDisabled(false);
        setError("");
      } else {
        setButtonDisabled(true);
        setError("Invalid email address");
      }
    } else {
      setButtonDisabled(true);
    }
  }, [user]);



  return (
    <div className="flex w-full h-screen items-center justify-center">
      {forgot ? (
        //Forgot password modal
        <>
        <div className="flex flex-col justify-center items-center bg-gray-500/10 max-h-screen p-4">
          <h1 className="text-2xl" onClick={() => setJumpModal(true)}>
            {loading ? "Processing.." : "Forgot password"}
          </h1>

            {emailSend !== "" ?
                <h3 className="mt-5">{emailSend}</h3> 
            :
            <div className="flex flex-col">
                <label
                    htmlFor="email"
                    className="w-full text-start text-sm text-gray-300 mb-1 mt-4"
                >
                    Email
                </label>
                <input
                    className="px-3 py-2 bg-transparent border border-gray-800"
                    type="email"
                    id="email"
                    value={verify.email}
                    onChange={(e) => setVerify({ ...verify, email: e.target.value })}
                    placeholder="Enter email"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <button
                    className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={onVerifyEmail}
                >
                    Verify email
                </button>
            </div>
            }

          <p className="text-[0.85rem] text-gray-400 mt-5">
            <span
              onClick={() => setForgot(false)}
              className="text-gray-300 cursor-pointer hover:text-white"
            >
              Back to login
            </span>
          </p>
        </div>

        {jumpModal && 
        <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center backdrop-blur-[10px]">
          <div className="border-0 border-blue-500 flex flex-col p-5">
          <h1 onClick={() => setJumpModal(false)}>Hello</h1>
                <input
                    className="px-3 py-2 bg-transparent border border-gray-800"
                    type="email"
                    id="email"
                    value={searchWord}
                    onChange={(e) => setSearchWord( e.target.value )}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <button
                    className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={onSearch}
                >
                    Go
                </button>
            </div>
        </div>
        }
        </>
      ) : (
        <div className="flex flex-col justify-center items-center bg-gray-500/10 max-h-screen p-4">
          <h1 className="text-2xl">{loading ? "Processing.." : "Login"}</h1>

          <label
            htmlFor="email"
            className="w-full text-start text-sm text-gray-300 mb-1 mt-4"
          >
            Email
          </label>
          <input
            className="px-3 py-2 bg-transparent border border-gray-800"
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter email"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <label
            htmlFor="password"
            className="w-full text-start text-sm text-gray-300 mb-1 mt-4"
          >
            Password
          </label>
          <input
            className="px-3 py-2 bg-transparent border border-gray-800"
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter password"
          />
          <p className="text-[0.75rem] text-gray-400 w-full flex justify-end">
            <span
              onClick={() => setForgot(true)}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Forgot password
            </span>
          </p>

          <button
            className="bg-white mt-5 text-gray-900 text-sm px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={onLogin}
          >
            Login here
          </button>

          <p className="text-[0.85rem] text-gray-400 mt-5">
            Do not have any account?{" "}
            <Link href="/signup" className="text-gray-300 hover:text-white">
              Signup here
            </Link>
          </p>
        </div>
      )}
      <Toaster />
    </div>
  );
}
