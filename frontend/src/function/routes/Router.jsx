import React, { useEffect, useState } from 'react'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Login from '../../screen/Login'
import Register from '../../screen/Register'
import Home from '../../screen/Home'
import { axiosInstance } from '../axiosInstance'
import { useNavigate } from "react-router-dom";
import Chats from '../../screen/Chats'
import RecentChat from '../../screen/RecentChat'


const Router = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Home />} />
        <Route path='/recents' element={<Chats />} />
        <Route path='/recents/:id' element={<RecentChat />} />
        
    </Routes>
    </BrowserRouter>
  )
 
  }
  const Root = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const checkAuth = async () => {
        try {
          await axiosInstance.get("/profile" ,{
            headers: {
              "Content-Type": "application/json",
              "accesstoken": localStorage.getItem("accesstoken")
            },
          });
          setIsLoading(false);
          setIsAuthenticated(true);
        } catch (error) {
          setIsLoading(false);
          setIsAuthenticated(false);
        }
      };
      checkAuth();
    }, []);
  
    if (isLoading) {
      return "...loading";
    }
  
    return isAuthenticated ? (
      navigate("/dashboard")
    ) : (
      navigate("/login")
    );
  };

export default Router
