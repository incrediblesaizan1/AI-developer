import React, { useState } from 'react'
import react from "../src/assets/react.svg"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import {axiosInstance} from "../function/axiosInstance"

const Register = () => {

    const [email, setEmail] = useState("")
    const [isShowPassword, setIsShowPassword] = useState("password")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const toggleShowPassword = () =>{
        if(isShowPassword === "password"){
            setIsShowPassword("text")
        }else{
            setIsShowPassword("password")
        }
    }

    const onSubmit = async(e) =>{
      e.preventDefault()

      if(!email){
       return setError("All fields are required")
      }else if(!password){
      return setError("Please enter the password")
      }

      setError("")
      setIsLoading(true)

      try {
      const user = await axiosInstance.post("/register",{
          email,
          password
        })
        setIsLoading(false);
        console.log("user logged in successfully", user)
        navigate("/dashboard");
 
      } catch (error) {
      setIsLoading(false);
        setError(error.response.data.message || "Something went wrong, please try again.")
        console.log("Login error:",error.response?.data || error.message)
      }

    }

    return (
        <div className="h-screen bg-gray-900 overflow-hidden relative">
          <div className="login-ui-box right-10 -top-40 " />
          <div className="login-ui-box bg-cyan-200  -bottom-40 right-2/3" />
    
          <div className="container h-screen flex items-center relative right-[23vw] justify-center px-20 mx-auto">
            <div
              className="w-2/4 h-[90vh] flex items-end bg-cover bg-center rounded-lg p-10 z-50"
            >
            </div>
    
            <div className="w-2/4 h-[75vh] bg-slate-700 rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
              <form onSubmit={onSubmit}>
                <h4 className="text-2xl text-zinc-400 font-semibold mb-7">Register</h4>
    
                <input
                  type="text"
                  placeholder="Enter your E-Mail or Username"
                  className="input-box bg-black text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              <div className="flex items-center bg-black text-white px-5 rounded mb-3">
      <input
        type={isShowPassword === "text" ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"Password"}
        className="w-full text-sm  py-5 bg-black text-white mr-3 rounded outline-none"
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
                {error ? <p className="text-red-500 text-xs pb-1">{error}</p> : ""}
    
                <button type="submit" className="btn-primary bg-slate-700">
                Create Account
                </button>
                {isLoading && "...loading"}
                <p className="text-xs text-slate-500 text-center my-4">Or</p>
                <button
                  type="button"
                  className="btn-primary btn-light"
                  onClick={() => navigate("/login")}
                >
                  LOGIN
                </button>
              </form>
            </div>
          </div>
        </div>
      );
}

export default Register
