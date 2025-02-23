import React, { useEffect, useState } from 'react'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Login from '../../screen/Login'
import Register from '../../screen/Register'
import Home from '../../screen/Home'
import { axiosInstance } from '../axiosInstance'
import { useNavigate } from "react-router-dom";


const Router = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Home />} />
        
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
          await axiosInstance("/profile");
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
