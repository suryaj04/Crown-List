import axios from "axios";
import { useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";

export default function Card({ title, desc, id, del, status }) {
  let [edit, setEdit] = useState(false);
  let [currentStatus, setCurrentStatus] = useState(status);
  let api = import.meta.env.VITE_API_URL;
  let Title = useRef();
  function editHandler() {
    if (edit) {
      let update = Title.current.innerText;
      axios.patch(`${api}todos/${id}.json`, { title: update }).then(()=>{
        setEdit(false);
      });
    } else {
      setEdit(true);
      setTimeout(()=>{
        Title.current.focus();
      }, 0);
    }
  }
  function statusHandler() {
    setCurrentStatus((prev) => !prev);
    axios.patch(`${api}todos/${id}.json`, { status: !status }).catch((err) => {
        console.error(err);
      });
  }
  return (
    <>
      <div title={title} className={status ? "bg-gray-300 text-gray-700 flex justify-between items-center w-[85%] sm:w-96 mx-auto p-1 mt-2 rounded-md" : "bg-[#5B2333] text-[#F7F4F3] flex justify-between items-center w-[85%] sm:w-96 mx-auto p-1 mt-2 rounded-md"}>
        <div>
          <input type="checkbox" onChange={statusHandler} checked={currentStatus ? true : false} className="accent-emerald-700"/>
          <h1 contentEditable={edit} tabIndex={0} suppressContentEditableWarning="true" ref={Title} aria-required className={ currentStatus ? "font-semibold inline line-through ml-2  sm:text-lg" : "font-semibold inline ml-2  sm:text-lg" } >{title}</h1>
          <h1 className={currentStatus ? " line-through ml-5" : "ml-5"}>{desc}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={editHandler} className={ !edit ? "bg-[#F7F4F3] sm:hover:bg-blue-50 sm:hover:text-blue-600  text-[#5B2333] px-2 py-1 font-semibold rounded-md  sm:text-xl " : "bg-green-50 text-[#5B2333] px-2 py-1 font-semibold rounded-md sm:text-xl"} >
            {edit ? <FaRegSave /> : <BiSolidEdit />}
          </button>
          <button onClick={() => del(id)} className="bg-[#F7F4F3] text-[#5B2333] px-2 transition-all py-1 font-semibold rounded-md text-xl sm:hover:bg-red-50 sm:hover:text-red-600"> <MdDeleteOutline /></button>
        </div>
      </div>
    </>
  );
}