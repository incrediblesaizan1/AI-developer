import React, { use, useEffect, useState } from "react";
import { axiosInstance } from "../function/axiosInstance";
import { useNavigate } from "react-router-dom";
import { RiLink } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import Loader from "./Loader"

const Home = () => {
  const [userData, setUserData] = useState("");
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true)
  
  const createProject = async () => {
    setLoading(true)
    try {
      if (!projectName) {
        return setError("please enter the project name");
      }
      const project = await axiosInstance.post("/create", {
        name: projectName,
      });
      setIsModalOpen(false);
      setError("");
      setProjectName("");
    } catch (error) {
      setError(error.response.data.message);
      console.log("Something went wrong while creating the project", error);
    }
  };

  useEffect(() => {
    setLoading(true)
    const fetchUser = async () => {
      try {
        const user = await axiosInstance.get("/profile");
        setUserData(user.data.email);

        const project = await axiosInstance.get("/get-user-project");
        setProject(project.data.projects);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUser();
    setLoading(false)
  }, [project,userData, isModalOpen]);


  return (
    <>

       <div className="bg-[rgb(0,0,0,0.7)] w-full h-screen text-white/80">
        <main className="p-4 ">
       <div className="projects  flex gap-3 flex-wrap ">
         <button
           onClick={() => setIsModalOpen(!isModalOpen)}
           className="project cursor-pointer hover:bg-slate-200 hover:border-slate-700 p-4 flex items-center border hover:text-slate-500 border-slate-300  rounded-md"
         >
           New Project <RiLink className=" ml-2 text-2xl" />
         </button>

         {project ? (
           [...project].reverse().map((e)=>(
             <div onClick={()=>(navigate(`/project/${e._id}`))} key={e._id} className="border w-44 text-sm py-2 px-4 cursor-pointer hover:bg-slate-200 hover:border-slate-700 hover:text-slate-500 border-slate-300 rounded-md">
               <span className="-ml-2 font-bold text-lg capitalize">{e.name}</span>
               <div className="flex -ml-3 mt-1 text-sm" >
                 <CiUser className="text-lg" /> <span className="text-xs mt-[2px]">Collaborators: {e.users.length}</span>
               </div>
       </div>
           ))
          ) : <Loader />}
          </div>

      {loading? <Loader />: (
        <>
         {isModalOpen && (
         <div className="  absolute top-0 left-0 w-full h-screen bg-[rgba(72,71,71,0.4)]  flex justify-center items-center">
           <div className="bg-[rgb(0,0,0,0.7)] p-6 rounded-lg shadow-lg w-96">
             <h2 className="text-xl text-white/70 font-semibold mb-4">Create New Project</h2>

             <label className="block text-gray-500 text-sm mb-2">
               Project Name
             </label>
             <input
               type="text"
               value={projectName}
               onChange={(e) => setProjectName(e.target.value)}
               className="w-full p-2 border  text-white border-gray-300 rounded-md mb-4"
               placeholder="Enter project name"
             />
             {error ? (
               <div className="text-rose-500 -mx-4 text-sm mb-3">{error}</div>
             ) : (
               ""
             )}
             <div className="flex justify-end space-x-2">
               <button
                 onClick={() => (
                   setIsModalOpen(false), setError(""), setProjectName("")
                 )}
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
       )}</>
      )}
     </main>
       </div>
    </>
  );
};

export default Home;
