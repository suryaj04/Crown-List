import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "./Card";
import { BlurFade } from "./components/magicui/blur-fade";
import { Ripple } from "./components/magicui/ripple";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { CrownIcon } from "lucide-react";

export default function App() {
  let { register, handleSubmit, reset } = useForm();
  let [ todos, setTodos ] = useState([]);
  let [ loading, setLoading ] = useState(false);
  let { user } = useUser();
  let { isSignedIn } = useAuth();
  let API = import.meta.env.VITE_API_URL;
  function submit(data) {
    setLoading(true);
    // Notification.permission === "default" ? requestPermission() : console.log("Permission is: ", Notification.permission);
    axios.post(`${API}todos.json`, {
        title: data.title,
        desc: data.description,
        createdBy: user.username,
        status: false,
        time:new Date(data.time).toLocaleString()
      }).then(() => {
        setLoading(false);
        reset();
        if(Notification.permission === "granted") new Notification("New task added", { body: `${data.title} has been added to the task list`});
      }).catch(error=> console.log('Task adding unsuccessful', error));
  }
  useEffect(() => {
    if (Notification.permission === "default") {
      requestPermission();
    }
  }, []);
  function requestPermission() {
    Notification.requestPermission().then(permission=> alert(`Notification permission is: ${permission}`));
  }
  function fetchTodo(){
    axios.get(`${API}todos.json`).then(todo=>{
      fetchTodo();
      let temp = [];
      for (let key in todo.data) {
        let task = {
          id: key,
          ...todo.data[key],
        };
        temp.push(task);
      }
      setTodos(temp);
    });
  }
  useEffect(() => {
    fetchTodo();
  }, []);
  function deletehandler(id) {
    axios.delete(`${API}todos/${id}.json`).then(()=>{
        console.log("successfully deleted");
      }).catch(error=>{
        console.error("Task deletion is unsuccessful",error);
      });
  }
  
  return (
    <div>
      <div className="border-b border-[#5B2333] text-[#5B2333] p-2">
        <header className="sm:w-[90%] w-11/12 lg:w-[900px] flex justify-between items-center mx-auto">
          <h1 className="font-bold text-xl sm:text-3xl flex items-center gap-2 font-mono" title="Website name"><CrownIcon color="#5B2333"/>CrownList</h1>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "sm:w-11 sm:h-11 w-10 h-10",
                }}} />
          </SignedIn>
        </header>
      </div>
      <SignedIn>
        <form className="sm:w-96 w-[90%] mx-auto p-2 mt-5" onSubmit={handleSubmit(submit)} >
          <h1 className="font-semibold text-xl text-[#2E382E] sm:text-2xl">Command a new task<span title="Username" className="text-[#5B2333] text-xl font-bold sm:text-2xl" >{isSignedIn ? ` ${user.firstName}` : ""}</span></h1>
          <div className="relative">
          <input required {...register("title")} type="text" id="title" className="w-full peer/title focus:outline-none my-1 border-b-2 border-[#5B2333] p-2 bg-inherit placeholder:invisible" placeholder="Enter title" title="Enter your title" />
          <label htmlFor="title" className="absolute -top-2 pointer-events-none transition-all duration-300 text-lg font-semibold left-2 text-[#5B2333] peer-placeholder-shown/title:top-4 peer-placeholder-shown/title:text-gray-400 peer-placeholder-shown/title:text-base ">Enter title</label>
          </div>
          <div className="relative flex gap-1">
          <input required {...register("description")} type="text" id="description" className="sm:w-[91%] w-[84%] peer/description focus:outline-none mt-1 border-b-2 border-[#5B2333] p-2 bg-inherit placeholder:invisible" placeholder="Enter title" title="Enter your description" />
          <label htmlFor="description" className="absolute -top-2 pointer-events-none transition-all duration-300 text-lg font-semibold left-2 text-[#5B2333] peer-placeholder-shown/description:top-4 peer-placeholder-shown/description:text-gray-400 peer-placeholder-shown/description:text-base">Enter description</label>
          <input type="datetime-local" {...register('time')} required className="sm:w-[9%] w-[16%] focus:outline-[#5B2333] mt-2 border-2 border-[#5B2333] p-1 rounded-md" />
          </div>
          <button title="Add your tasks" className="bg-[#5B2333] transition-all active:bg-[#7A3F5B] text-[#F7F4F3] px-3 py-1 mt-2 rounded-lg font-mono font-bold text-lg">
            {loading ? 
              <div className="flex items-center gap-1">
                <h1>Adding task</h1>
                <div className="loader"></div>
              </div> : "Add Task" }</button>
        </form>
        {todos.filter(todo=> isSignedIn ? todo.createdBy === user.username : true).length > 0 ? 
          <h1 className="font-semibold text-xl text-[#2E382E] sm:text-2xl my-2 text-center">Your tasks</h1> : <h1 className="font-semibold text-[#2E382E] text-xl sm:text-2xl my-2 text-center p-2">Your task list is waiting to be filled</h1> }
        <div className="flex flex-col-reverse">
          {todos.filter(todo=> isSignedIn ? todo.createdBy === user.username : true).map(todo=>(
              <Card
                title={todo.title}
                desc={todo.desc}
                del={deletehandler}
                key={todo.id}
                id={todo.id}
                status={todo.status}
                time={todo.time}
              /> ))}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="sm:w-[560px] w-[90%] absolute top-1/2 left-1/2 translate-x-[-50%] overflow-hidden text-pretty translate-y-[-50%] mx-auto">
          <BlurFade delay={0.5} inView>
            <h1 className="sm:text-3xl text-center text-[#5B2333] text-2xl font-black">Simplify, Organize, Accomplish.</h1>
            <p className=" text-[#2E382E] font-semibold text-center text-lg">Streamline your day and focus on what matters most. Our intuitive to-do app helps you prioritize, organize, and tackle your tasks with ease.</p>
            <center>
              <SignInButton className="font-bold px-5 py-2 bg-[#5B2333] text-[#F7F4F3] mt-2 rounded-full" />
            </center>
          </BlurFade>
        </div>
        <Ripple />
      </SignedOut>
    </div>
  );
}