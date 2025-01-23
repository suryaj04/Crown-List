import axios from "axios";
import { useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";

export default function Card({ title, desc, id, del,status }) {
  let [edit, setEdit] = useState(false);
  let [save, setSave] = useState(false);
  let [currentStatus,setCurrentStatus] = useState(status)
  let api = import.meta.env.VITE_API_URL;
  let Title = useRef();
  function editHandler() {
    if (edit) {
      let update = Title.current.innerText;
      axios.patch(`${api}todos/${id}.json`, { title: update }).then(() => {
        setEdit(false);
        setSave(true);
        setTimeout(() => {
          setSave(false);
        }, 1500);
      });
    } else {
      setEdit(true);
      setTimeout(() => {
        Title.current.focus();
      }, 0);
    }
  }
  function statusHandler(){
    setCurrentStatus(prev=>!prev)
    axios.patch(`${api}todos/${id}.json`, { status: !status }).then(()=>{
      console.log(currentStatus)
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <>
      <div
        title={title}
        className="bg-slate-50 transition-all flex justify-between items-center w-[85%] sm:w-96 mx-auto p-1 mt-2 rounded-md border border-slate-400"
      >
        <div>
          <input type="checkbox" onChange={statusHandler} checked={currentStatus ? true : false} className="accent-slate-50"/>
          <h1
            contentEditable={edit}
            tabIndex={0}
            suppressContentEditableWarning="true"
            ref={Title}
            aria-required
            className={currentStatus ? "font-semibold inline line-through ml-2 font-mono text-lg" : "font-semibold inline ml-2 font-mono text-lg"}
          >
            {title}
          </h1>
          <h1 className={currentStatus ?  "font-mono line-through ml-5" : 'font-mono ml-5'}>{desc}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={editHandler}
            className={
              !edit
                ? "bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 text-slate-600 px-3 py-1 font-semibold rounded-md border text-2xl border-slate-600"
                : "bg-green-50 text-green-600 px-3 py-1 font-semibold rounded-md border text-2xl border-green-600"
            }
          >
            {edit ? <FaRegSave /> : <BiSolidEdit />}
          </button>
          <button
            onClick={() => del(id)}
            className="bg-slate-50 text-slate-600 px-3 transition-all py-1 font-semibold rounded-md border text-2xl border-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          >
            <MdDeleteOutline />
          </button>
        </div>
      </div>
      <div
        className={
          save
            ? "absolute text-green-600 hidden sm:block top-10 left-10 border transition-all scale-1 bg-green-100 p-1 rounded-sm border-green-600 font-bold font-mono text-lg"
            : "absolute top-10 left-1/2 hidden sm:block text-green-600 border transition-all scale-0 bg-green-100 p-1 rounded-sm border-green-600 font-bold font-mono text-lg"
        }
      >
        Title updated successfully
      </div>
    </>
  );
}
