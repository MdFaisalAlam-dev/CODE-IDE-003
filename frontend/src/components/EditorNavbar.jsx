import React from 'react'
import logo from "../images/logo.png"
import { FiDownload } from "react-icons/fi";
import { FiSave } from "react-icons/fi";


const EditorNavbar = () => {
  return (
    <>
      <div className="EditorNavbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]" >
        <div className="logo">
          <img className="w-[40px] sm:w-[50px] md:w-[60px] lg:w-[70px] cursor-pointer rounded-lg" src={logo} alt="" />
        </div>
        <p>File / <span className='text-[gray]'>My first project</span></p>
        <div className="flex items-center gap-[15px]">
        <i className='p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]'><FiSave /></i>
         <i className='p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]'><FiDownload /></i>
         </div>
      </div>
    </>
  )
}

export default EditorNavbar;