import React, { useEffect, useState } from "react";
import { axiosInstance } from "../function/axiosInstance";
import { useNavigate } from "react-router-dom";
import { RiLink } from "react-icons/ri";

const Home = () => {
  const [userData, setUserData] = useState("");
  const [projectName, setProjectName] = useState("")
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();

  const createProject = async() =>{
    try {
      if(!projectName){
 return setError("please enter the project name")
      }
      const project = await axiosInstance.post("/create",{
        name: projectName
      })
      setIsModalOpen(false)
      setError("")
      setProjectName("")
      console.log(project)
    } catch (error) {
      setError(error.response.data.message)
      console.log("Something went wrong while creating the project", error)
    }
  }

  useEffect(() => {

      const fetchUser = async () => {
        try {
        const user = await axiosInstance.get("/profile");
        setUserData(user.data.email);
      }
     catch (error) {
      navigate("/login");
    }
  }
      fetchUser();
   
  }, []);

  return (
    <>
      <main className="p-4">

        <div className="projects">
          <button onClick={ () => setIsModalOpen(!isModalOpen)} className="project p-4 flex border border-slate-300  rounded-md">
           New Project <RiLink className=" ml-2 text-2xl" />
          </button>
        </div>

    {isModalOpen && (
       <div className=" absolute top-0 left-0 w-full h-screen bg-[rgba(72,71,71,0.4)]  flex justify-center items-center">
       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
         <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
         
         <label className="block text-gray-700 text-sm mb-2">Project Name</label>
         <input
         type="text"
         value={projectName}
         onChange={(e)=>(setProjectName(e.target.value))}
           className="w-full p-2 border border-gray-300 rounded-md mb-4"
           placeholder="Enter project name"
         />
 {error ? <div className="text-rose-500 -mx-4 text-sm mb-3">{error}</div> : "" }
         <div className="flex justify-end space-x-2">
           <button 
           onClick={()=>(setIsModalOpen(false), setError(""),setProjectName("")  )}
             className="bg-gray-300 px-4 cursor-pointer py-2 rounded-md text-gray-700"
           >
             Cancel
           </button>
           <button 
           onClick={createProject}
             className="bg-blue-600 px-4 py-2 cursor-pointer rounded-md text-white"
           >
             Create
           </button>
         </div>
       </div>
     </div>
      )}

      </main>
    </>
  );
};

export default Home;
