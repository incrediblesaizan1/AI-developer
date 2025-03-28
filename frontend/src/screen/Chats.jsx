import React, { useEffect, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import Botton from "../Components/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { axiosInstance } from "../function/axiosInstance";
import { MdOutlineDelete } from "react-icons/md";
import Loader from "../screen/Loader";

const Chats = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString)
   return date.getDate().toString().padStart(2, "0") +
      " " +
      date.toLocaleString("en-US", { month: "short" }).toUpperCase() +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
  };

  useEffect(() => {
    setLoading(true);
    const findingUser = async () => {
      try {
        await axiosInstance.get("/profile" ,{
          headers: {
            "Content-Type": "application/json",
            "accesstoken": localStorage.getItem("accesstoken")
          },
        });
      } catch (error) {
        navigate("/login");
      }
    };

    const userQuestion = async () => {
      const question = await axiosInstance.get("/user-question" ,{
        headers: {
          "Content-Type": "application/json",
          "accesstoken": localStorage.getItem("accesstoken")
        },
      });
      setAllResults(question.data.questions);
      setFilteredResults(question.data.questions);
    };

    findingUser();
    userQuestion();
    setLoading(false);
  }, [allResults]);

  const searchResults = () => {
    if (search.trim() === "") {
      setFilteredResults(allResults);
      return;
    }

    const filtered = allResults.filter((e) => {
      return e.question.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredResults(filtered);
  };

  const deleteMessage = async (id) => {
    setLoading(true);
    await axiosInstance.delete(`/delete-question/${id}` ,{
      headers: {
        "Content-Type": "application/json",
        "accesstoken": localStorage.getItem("accesstoken")
      },
    });

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-screen w-full overflow-auto custom-scrollbar bg-[#292927] text-white">
          <div className="flex items-center p-3 w-full justify-between px-4 sticky top-0 bg-slate-700">
            <div className="flex gap-16 items-center">
              <Botton />
              <div className="flex items-center gap-2 text-2xl">
                <IoChatbubblesOutline className="text-3xl" />
                Your Chat history
              </div>
            </div>

            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-3 py-1 text-lg cursor-pointer text-black gap-1 bg-[#52ced6] rounded-lg"
              >
                {" "}
                <IoIosAddCircleOutline className="text-2xl" /> Start New Chat
              </button>
            </div>
          </div>

          <div className="text-center py-6">
            <div className="bg-[#3d3d3a] px-2 text-white w-2/4 flex rounded-lg items-center mx-auto h-12">
              <CiSearch className="text-2xl" />
              <input
                type="text"
                value={search}
                onChange={(e) => (setSearch(e.target.value), searchResults())}
                className=" w-full bg-transparent outline-none px-2 "
                placeholder="Search your chats..."
              />
            </div>

            <div>
              {filteredResults
                ? filteredResults.reverse().map((e) => (
                    <div
                      key={e._id}
                     
                      className=" text-white cursor-pointer bg-slate-700 my-3 w-2/4 h-16 text-start content-center px-6 rounded-2xl mx-auto"
                    >
                      {e.question.length > 68 ? (
                        <div className="w-full flex items-center justify-between">
                        <h1  onClick={() => navigate(`/recents/${e._id}`)} className="capitalize w-full text-lg flex items-center justify-between">
                          {e.question.trim().slice(0, 68)}...{" "}
                          
                        </h1>
                        <MdOutlineDelete
                            className="text-red-500 w-12 h-5 hover:text-blue-300 cursor-pointer"
                            onClick={() => deleteMessage(e._id)}
                          />
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-between">
                        <h1  onClick={() => navigate(`/recents/${e._id}`)} className="capitalize w-full text-lg flex items-center justify-between">
                          {e.question.trim().slice(0, 72)}{" "}
                         
                        </h1>
                        <MdOutlineDelete
                            className="text-red-500 w-12 h-5 hover:text-blue-300 cursor-pointer"
                            onClick={() => deleteMessage(e._id)}
                            />
                            </div>
                      )}

                      <h3 className="text-xs text-slate-500">{formatDate(e.date)}</h3>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
