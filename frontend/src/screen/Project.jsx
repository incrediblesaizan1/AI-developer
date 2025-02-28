import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { BiSolidUserCircle } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import {axiosInstance} from "../function/axiosInstance"
import {data, useParams} from "react-router-dom"
import Loader from "./Loader";
import { initializeSocket,receiveMessage, sendMessage } from "../function/socketio";
import { useRef } from "react";


const Project = () => {
  const [sidePanel, setSidePanel] = useState(true);
  const [colabModal, setColabModal] = useState(false)
  const [users, setUsers] = useState(null)
  const [error,setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [colabUser, setColabUser] = useState(null)
  const [message, setMessage] = useState("")
  const [user, setUser] = useState(null)
  const messageBox = useRef()

const {id} = useParams()

  const addColaborator = async(e) =>{
  setLoading(true)
  try {
    const addUser =await axiosInstance.put(`/add-user/${id}`,{
      "collaboratorEmail": e.email
    }) 
    console.log("Colaborator added successfully.")
    setError("")
    setColabModal(false)
    setLoading(false)
  } catch (error) {
    console.log("Something went wrong while adding colaborator.", error)
    setError(error.response.data.message)
    setLoading(false)
  }
  }

  const scrollToBottom = () =>{
    messageBox.current.scrollTop = messageBox.current.scrollHeight
  }

  const appendIncomingMessage = async(data) => {
    const message = messageBox.current;

  const user = await axiosInstance.get(`/user/${data.sender}`)

    const createDiv = document.createElement("div");
    const emailDiv = document.createElement("div");

   
    emailDiv.innerText = await user.data.user.email;
    createDiv.innerText = data.message;

    
    createDiv.classList.add(
     "bg-white", "text-md", "mt-2", "rounded","max-h-40", "overflow-auto", "custom-scrollbar2", "text-left", "text-black", "p-2", "w-[60%]"
    );

   
    emailDiv.classList.add(
        "text-xs", 
        "text-zinc-400", 
        "mt-1"          
    );

    createDiv.prepend(emailDiv);  
    message.appendChild(createDiv);
    scrollToBottom()
};

const appendOutgoingMessage = (message, user) => {
  const messageBox2 = messageBox.current;

  const createDiv = document.createElement("div");
  const emailDiv = document.createElement("div");

 
  createDiv.innerText = message;
  emailDiv.innerText = user.email;

  
  createDiv.classList.add(
    "ml-auto",            
        "text-md",            
        "bg-slate-700",       
        "mt-2",               
        "rounded",            
        "max-h-40",           
        "overflow-auto",      
        "text-left",          
        "text-white/70",      
        "p-2",                
        "w-[60%]");

 
  emailDiv.classList.add(
      "text-xs", 
      "text-zinc-500", 
      "mt-1"          
  );

  createDiv.prepend(emailDiv);  
  messageBox2.appendChild(createDiv);
  scrollToBottom()
};

  const send = () =>{

    sendMessage("project-message",{
      message,
      sender: user.userId
    })
    appendOutgoingMessage(message, user)
    console.log(message)
    setMessage("")
  }

  useEffect(() => {
    setLoading(true)

    const getUsers = async() =>{
      const users = await axiosInstance.get("/get-all-users")
      setUsers(users.data.users)
    }


    const getPostColab = async () =>{
      const post = await axiosInstance.get(`/colabUsers/${id}`)
      setColabUser(post.data.usersData)
    }

    const findingUser = async () =>{
      const user = await axiosInstance.get("/profile")
      setUser(user.data.user.data)
    }
    
    
    const setupSocket = async () => {
      const socket = await initializeSocket(id);
      if (socket) {
        receiveMessage("project-message", (data) => {
          console.log(data);
          appendIncomingMessage(data)
        });
      } else {
        console.error("Socket instance is null, cannot receive messages.");
      }
    };
    
    
    getPostColab();
    getUsers();
    setupSocket();
    findingUser()
    
    setLoading(false)
  }, [id, colabModal])





  return (
    <>
    {loading? <Loader /> : (
      <div className="w-full relative h-full bg-[rgb(0,0,0,0.7)]">
      <div className=" relative bg-[rgb(0,0,0)] text-white/60 w-[25vw] h-full">

        <div className="h-[8vh] bg-slate-300 w-full px-1 flex items-center justify-between">
          <div className="flex items-center">
        <IoMdAdd onClick={()=>setColabModal(true)} className="text-black cursor-pointer text-4xl" /> 
        <span className="text-black">Add collaborator</span>
          </div>
          <FaUsers
            onClick={() => setSidePanel(!sidePanel)}
            className="text-black cursor-pointer hover:text-slate-400 text-4xl "
          />
        </div>

        <div ref={messageBox} className="h-[84vh] overflow-auto p-1 custom-scrollbar2">
          
        </div>

        <div className="h-[8vh] flex bg-slate-900">
          <textarea
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
            type="text"
            className="bg-white text-md resize-none border-none outline-none w-[83%] text-black px-3 pt-2 custom-scrollbar2 break-words whitespace-pre-wrap h-full"
            placeholder="Enter message"
          />{" "}
          <IoIosSend onClick={send} className=" text-4xl mt-3  cursor-pointer ml-3 " />
        </div>

        <div
          className={`absolute overflow-y-auto overflow-x-hidden custom-scrollbar2  top-0 transition-all ${
            sidePanel ? "-translate-x-[100%]" : "-translate-x-0"
          }   w-full h-full bg-[rgb(60,60,60)]`}
        >
          <div className="h-[8vh] bg-slate-300 w-full flex justify-between items-center px-3">
            <h1 className="text-2xl text-black">Collaborators</h1>
            <RxCross1
              onClick={() => setSidePanel(!sidePanel)}
              className="text-black text-2xl cursor-pointer fixed left-84 top-5 "
            />
          </div>

          {colabUser? colabUser.map((e)=>(
            <div key={e.email} className="bg-white hover:bg-slate-400 flex h-[8vh] my-2 rounded-md px-1 mx-2 items-center">
            <BiSolidUserCircle className="text-slate-700 text-4xl " />{" "}
            <div className="text-black font-bold mx-1">{e.email}</div>
          </div>
          )): ""}
        </div>

      </div>

       {colabModal && (
        <div className="absolute overflow-auto custom-scrollbar2 top-[30%] left-[45%] bg-white rounded-lg text-black w-[30%] h-[50vh] ">
          <div className="flex justify-between items-center p-3">
          <h1 className=" text-xl ">Select User</h1>
          <RxCross1 className="cursor-pointer" onClick={()=>setColabModal(false)} />
          </div>
          <div className="px-3">
            {users? users.map((e)=>(
              <div key={e.email} onClick={()=>(addColaborator(e))} className=" w-full cursor-pointer bg-slate-300 flex items-center gap-2 p-3 h-12 rounded-lg my-1 ">
                <BiSolidUserCircle className="text-4xl" />
                <div>{e.email}</div>
              </div>
              
            )) : ""}
          </div>
          {error && <span className=" mx-2 absolute text-sm text-rose-500 bottom-0 ">{error}</span>}
        </div>
      )}

      <div></div>
    </div>
    )}
    </>
  );
};

export default Project;