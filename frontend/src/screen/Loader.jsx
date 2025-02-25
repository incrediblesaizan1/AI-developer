import React from "react";
import { PuffLoader  } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed left-0 top-0 flex justify-center items-center h-screen w-full bg-[rgb(0,0,0,0.7)] z-100">
      <PuffLoader  color="#ffffff" size={140} />
    </div>
  );
};

export default Loader;
