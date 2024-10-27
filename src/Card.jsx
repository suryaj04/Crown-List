import axios from 'axios'
import { useRef, useState } from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";

export default function Card({title,desc,id,del}) {
  let [edit,setEdit] = useState(false)
  let [save,setSave] = useState(false)
  let api = 'https://todos-eb5ee-default-rtdb.asia-southeast1.firebasedatabase.app/'
  let Title = useRef()
  function editHandler(){
    if(edit){
      let update = Title.current.innerText
      axios.patch(`${api}todos/${id}.json`,{title:update}).then(()=>{
        setEdit(false)
        setSave(true)
        setTimeout(()=>{
          setSave(false)
        },1500)
      })
    }
    else{
      setEdit(true)
      setTimeout(()=>{
        Title.current.focus()
      },0)
    }
  }
  return (
   <>
     <div title={title} className='bg-blue-50 hover:scale-105 transition-all flex justify-between items-center w-96 mx-auto p-2 mt-2 rounded-md border border-blue-600'>
      <div>
      <h1 contentEditable={edit} tabIndex={0} suppressContentEditableWarning='true' ref={Title} aria-required className='font-semibold p-1 font-mono  text-lg'>{title}</h1>
      <h1 className='font-mono'>{desc}</h1>
      </div>
        <div className='flex gap-2'>
      <button onClick={editHandler} className={!edit ? 'bg-blue-50 text-blue-600 px-3 py-1 font-semibold rounded-md border text-2xl border-blue-600' : 'bg-green-50 text-green-600 px-3 py-1 font-semibold rounded-md border text-2xl border-green-600' }>{edit ? <FaRegSave /> : <BiSolidEdit />}</button>
      <button onClick={()=>del(id)} className='bg-red-50 text-red-600 px-3 py-1 font-semibold rounded-md border text-2xl border-red-600'><MdDeleteOutline /></button>
        </div>
    </div>
    <div className={save ? "absolute text-green-600 top-10 left-10 border transition-all scale-1 bg-green-100 p-2 rounded-sm border-green-600 font-bold font-mono text-lg" : "absolute top-10 left-10 text-green-600 border transition-all scale-0 bg-green-100 p-2 rounded-sm border-green-600 font-bold font-mono text-lg"}>Title updated successfully</div>
   </>
  )
}