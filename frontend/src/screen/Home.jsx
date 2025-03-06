import React, { useEffect, useState } from "react";
import { axiosInstance } from "../function/axiosInstance";
import Loader from "./Loader";
import Loader2 from "./Loader2";
import { useRef } from "react";
import Button from "../Components/button";
import Menu from "../../public/menu.svg";
import { IoIosFlower } from "react-icons/io";
import arrow from "../../public/arrow.svg";
import AppendResponse from "../Components/AppendResponse";
import { useNavigate } from "react-router-dom";
import { PiChatTextFill } from "react-icons/pi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const [sidePanel, setSidePanel] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [promptResponse, setPromptResponse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQue, setSelectedQue] = useState({});
  const [inputDown, setInputDown] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageBox = useRef();
  const submitRef = useRef();

  const scrollToBottom = () => {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  };

  const appendOutgoingMessage = (message, user) => {
    if (!messageBox.current) {
      console.error("messageBox is null");
      return;
    }

    const createDiv = document.createElement("div");
    // const emailDiv = document.createElement("div");

    createDiv.innerText = message || "hello";
    // emailDiv.innerText = user?.email || "saini@gmail.com";

    createDiv.classList.add(
      "bg-[#1c1b1a]",
      "w-fit",
      "max-w-[45vw]",
      "p-2",
      "mt-3",
      "rounded-md"
    );

    // emailDiv.classList.add("text-xs", "text-zinc-500", "mt-1");

    // createDiv.prepend(emailDiv);
    messageBox.current.appendChild(createDiv);
    scrollToBottom();
  };

  const fetchQuestion = async (e) => {
    setMessageLoading(true);
    const data = await axiosInstance.post("/find-question", {
      question: e._id,
    });
    appendOutgoingMessage(data.data.find.question, user);
    setMessage("");
    setSelectedQue(data.data.find);
    setPromptResponse(data.data.find.response);
    console.log(promptResponse);
    setMessageLoading(false);
  };

  const searchChat = async (id) => {
    setInputDown(true);
    setMessages([]);
    setMessageLoading(true);
    const data = await axiosInstance.post("/find-question", {
      question: id,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: data.data.find.question, type: "outgoing" },
      { text: data.data.find.response, type: "incoming" },
    ]);
    setMessageLoading(false);
  };

  const send = async () => {
    if (!message.trim()) return;

    messages.push({ text: message, type: "outgoing" });
    setMessage("");
    setMessageLoading(true);
    scrollToBottom();

    try {
      let response = await axiosInstance.post("/prompt", { prompt: message });

      messages.push({ text: response.data, type: "incoming" });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessageLoading(false);
  };

  const textinpFocus = () => {
    document.querySelector(".textinp").focus();
  };

  document.addEventListener("keydown == 'ENTER'", () => {
    if (message !== "") {
      submitRef.current.click();
    }
  });

  useEffect(() => {
    setLoading(true);

    const findingUser = async () => {
      try {
        const user = await axiosInstance.get("/profile");
        setUser(user.data.user.data);
      } catch (error) {
        navigate("/login");
      }
    };

    const userQuestion = async () => {
      const question = await axiosInstance.get("/user-question");
      setQuestions(question.data.questions);
    };

    findingUser();
    userQuestion();

    setLoading(false);
  }, [promptResponse]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full overflow-hidden text-white relative h-screen bg-[#272725]">
            <div className="header h-16 flex p-4 justify-between w-full ">
              <div onClick={textinpFocus}>
                <Button />
              </div>

              <div
                className="bg-zinc-300/40 h-10 rounded-full cursor-pointer p-2 hover:bg-zinc-300 "
                onClick={() => setSidePanel(true)}
              >
                <img src={Menu} alt="menu" className="text-white w-6" />
              </div>
            </div>

            <div
              ref={messageBox}
              className={`w-[50vw] custom-scrollbar2 pb-52 overflow-auto ${
                inputDown ? "block" : "hidden"
              } mx-auto  h-full`}
            >
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`w-fit max-w-[45vw] p-2 mt-3 rounded-md ${
                      msg.type === "outgoing"
                        ? "bg-[#1c1b1a] self-end"
                        : "bg-[#31312e] self-start"
                    }`}
                  >
                    {msg.type === "incoming" ? (
                      <AppendResponse promptResponse={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                ))}
                <div>
                  {!messageLoading && (
                    <IoIosFlower className="text-4xl mt-2 text-[#52ced6]" />
                  )}
                </div>
              </>

              {messageLoading && <Loader2 />}
            </div>

            {sidePanel && (
              <div className="w-[24vw] p-2 px-3 overflow-auto custom-scrollbar2 fixed top-0 right-0 ml-auto bg-[#21201f] h-screen z-100">
                <div className="flex items-center justify-between sticky -top-2 py-2 px-2 backdrop-blur-2xl -mx-3">
                  <h1 className="text-3xl">SK'ask</h1>
                  <RxCross2
                    onClick={() => setSidePanel(false)}
                    className="text-2xl cursor-pointer"
                  />
                </div>

                <div
                  onClick={() => (
                    setMessages([]), setSidePanel(false), textinpFocus()
                  )}
                  className="flex items-center gap-2 mt-4 cursor-pointer  bg-[#1a1918] rounded py-1 text-[#52ced6] px-3"
                >
                  <PiChatTextFill />
                  Start new chat
                </div>
                <div
                  onClick={() => navigate("/recents")}
                  className="flex items-center gap-2 my-1 cursor-pointer hover:bg-[#1a1918] rounded py-1 px-3"
                >
                  <IoChatbubblesOutline />
                  Chats
                </div>
                <div>
                  <h1>Recents</h1>

                  <div>
                    {questions.reverse().map((e) => (
                      <div
                        key={e.date}
                        onClick={() => searchChat(e._id)}
                        className="flex cursor-pointer items-center gap-2 hover:bg-[#1a1918] rounded py-1 px-3"
                      >
                        {e.question.length > 38 ? (
                          <h1>{e.question.trim().slice(0, 38)}...</h1>
                        ) : (
                          <h1>{e.question}</h1>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="w-full mx-auto flex flex-col justify-center items-center py-14">
              {!inputDown && (
                <div className="flex items-center text-6xl">
                  <IoIosFlower className="text-6xl text-[#52ced6]" /> Good
                  evening, Saizan
                </div>
              )}

              <div
                className={`mt-12 bg-[#3d3d3a] fixed  ${
                  inputDown ? "-bottom-3" : "top-40"
                }  rounded-2xl  pr-12 p-1`}
              >
                {message.trim() !== "" && (
                  <button
                    onClick={() => (send(), setInputDown(true), setMessage(""))}
                  >
                    <img
                      ref={submitRef}
                      src={arrow}
                      alt=""
                      className="absolute right-3 bg-[#a3512b] p-2 rounded-xl cursor-pointer top-2"
                    />
                  </button>
                )}
                <textarea
                  value={message}
                  placeholder="Ask anything"
                  onChange={(e) => setMessage(e.target.value)}
                  className=" textinp bg-transparent resize-none text-justify rounded-xl p-2 w-[48vw] outline-none custom-scrollbar2 min-h-28 max-h-96 overflow-y-auto"
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = `${Math.max(
                        112,
                        Math.min(el.scrollHeight, 384)
                      )}px`;
                    }
                  }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.max(
                      112,
                      Math.min(e.target.scrollHeight, 384)
                    )}px`;
                  }}
                ></textarea>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
