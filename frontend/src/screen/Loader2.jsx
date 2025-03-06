import React from "react";
import { PuffLoader } from "react-spinners";
import { IoIosFlower } from "react-icons/io";

const Loader = () => {
  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="relative top-[2%]">
        {/* <PuffLoader color="#ffffff" size={40} /> */}
        <IoIosFlower
          className="text-4xl text-[#52ced6]"
          style={{ animation: "spin 3s linear infinite" }}
        />
      </div>
    </>
  );
};

export default Loader;
