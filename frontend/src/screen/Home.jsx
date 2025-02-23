import React, { useEffect, useState } from "react";
import { axiosInstance } from "../function/axiosInstance";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userData, setUserData] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
  try {
      const fetchUser = async () => {
        const user = await axiosInstance.get("/profile");
        setUserData(user.data.email);
      };
      fetchUser();
  } catch (error) {
    navigate("/login")
  }
  }, []);

  return <div>{userData ? userData : "...loading"}</div>;
};

export default Home;
