import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../function/axiosInstance";
import Loader from "./Loader";
import { IoIosFlower } from "react-icons/io";
import Code from "../assets/code.svg"
import ur from "../assets/1-n.svg"

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isShowPassword, setIsShowPassword] = useState("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    if (isShowPassword === "password") {
      setIsShowPassword("text");
    } else {
      setIsShowPassword("password");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name || !username) {
      return setError("All fields are required");
    } else if (!password) {
      return setError("Please enter the password");
    }

    setError("");
    setIsLoading(true);

    try {
      const user = await axiosInstance.post("/register", {
        email,
        name,
        username,
        password,
      });
      setIsLoading(false);
      console.log("user logged in successfully", user);
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      setError(
        error.response.data.message || "Something went wrong, please try again."
      );
      console.log("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen w-full bg-[#faf9f5] flex py-4 px-4">
      <div className="w-[50vw] py-2 text-center">
        <div className="flex items-start justify-between  pr-2 mb-8">

        <div className="flex justify-start items-center mb-4 text-4xl">
          <IoIosFlower className="text-6xl text-[#52ced6]" />
          SK'ask
        </div>

        <div className="flex flex-col justify-end items- ">
          <h1 className="text-6xl mb-4 text-[#29261b] font-serif">
            Your ideas,
            <br />
            amplified
          </h1>
          <p className="text-[#29261b]">
            Privacy-first AI that helps you create in confidence.
          </p>
        </div>
        </div>

        <div className="bg-[#faf9f5] mx-auto px-8 pt-8 pb-4 rounded-3xl w-3/4 h-fit mt-4 border border-zinc-300">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Enter your Name"
              className="input-box bg-white text-black border h-12 border-slate-600 rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your Username"
              className="input-box bg-white text-black border h-12 border-slate-600 rounded-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your E-Mail"
              className="input-box bg-white text-black border h-12 border-slate-600 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center bg-white border border-slate-600 text-black px-5 rounded-xl mb-3">
              <input
                type={isShowPassword === "text" ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={"Password"}
                className="w-full text-sm py-5 h-12 bg-transparent mr-3 rounded outline-none"
              />
              {isShowPassword === "text" ? (
                <FaRegEye
                  size={22}
                  className="text-[#05B6D3] cursor-pointer"
                  onClick={() => toggleShowPassword()}
                />
              ) : (
                <FaRegEyeSlash
                  size={22}
                  className=" text-zinc-500 cursor-pointer"
                  onClick={() => toggleShowPassword()}
                />
              )}
            </div>
            {error ? (
              <p className="text-red-500 text-xs pb-1 pl-2 text-start">
                {error}
              </p>
            ) : (
              ""
            )}

            <button
              type="submit"
              className="btn-primary bg-[#52ced6] hover:text-black"
            >
              Create Account
            </button>
            {isLoading && <Loader />}
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light bg-transparent shadow-none border border-gray-400 hover:bg-[#52ced6] hover:text-black"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      <div className="bg-[#f0eee6] w-[50vw] h-full  rounded-2xl px-4 py-36">
        <div className="w-3/4 text-start ">
          <div className="bg-[#e4e2d8] flex h-14 font-semibold gap-2 w-4/6 text-md rounded-xl mx-auto px-2 py-1">
            <img
              src={ur}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <p>Hi ask! Identify code optimizations and performance improvements.</p>
          </div>

          <div className="mt-12 mx-auto w-2/3 ml-52">
          <div className="bg-white h-10 py-2  w-[19vw] text-md rounded-xl px-3 relative right-14 top-5 ">
          <p>All set. Here's the optimized code.</p>
          </div>
            <img src={Code} alt="" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
