import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "./Card";
import { BlurFade } from "./components/magicui/blur-fade"
import { Ripple } from "./components/magicui/ripple"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";

export default function App() {
  let { register, handleSubmit, reset } = useForm();
  let [todos, setTodos] = useState([]);
  let [notification, setNotification] = useState(false);
  let [load, setLoad] = useState(false);
  let [deleteStatus, setDeleteStatus] = useState(false);
  let { user } = useUser();
  let { isSignedIn } = useAuth();
  let api = import.meta.env.VITE_API_URL;
  function submit(data) {
    setLoad(true);
    axios
      .post(`${api}todos.json`, {
        title: data.title,
        desc: data.description,
        createdBy: user.username,
        status: false,
        priority: "low priority",
      })
      .then(() => {
        setLoad(false);
        setNotification(true);
        setTimeout(() => {
          setNotification(false);
        }, 1500);
        reset();
      })
      .catch((error) => {
        error = "Task adding unsuccessful, please try again";
        console.log(error);
      });
  }
  function fetchTodo() {
    axios.get(`${api}todos.json`).then((todo) => {
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
    setDeleteStatus(false);
    axios
      .delete(`${api}todos/${id}.json`)
      .then(() => {
        setDeleteStatus(true);
        setTimeout(() => {
          setDeleteStatus(false);
        }, 1500);
      })
      .catch((error) => {
        error = "Deletion unsuccessfull";
        console.log(error);
      });
  }
  return (
    <div>
      <div className="border-b border-[#5B2333] bg-[#F7F4F3] text-[#5B2333] p-3">
        <header className=" sm:w-[90%] w-11/12  md:w-[90%] lg:w-[900px] flex justify-between items-center mx-auto">
          <h1
            className="font-bold text-xl sm:text-3xl font-mono"
            title="Website name"
          >
            CrownList
          </h1>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-11 h-11",
                },
              }}
            />
          </SignedIn>
        </header>
      </div>
      <SignedIn>
        <form
          action=""
          className="sm:w-96  w-[90%] mx-auto p-2 mt-5"
          onSubmit={handleSubmit(submit)}
        >
          <h1
            className="font-semibold text-xl text-[#2E382E] sm:text-2xl"
            title="Just a dialogue"
          >
            Command a new task
            <span
              title="Username"
              className="text-[#5B2333] text-xl font-bold sm:text-2xl"
            >
              {isSignedIn ? ` ${user.firstName}` : ""}
            </span>
          </h1>
          <input
            required
            {...register("title")}
            type="text"
            className="w-full focus:outline-[#5B2333] mt-2 border p-2 rounded-md"
            placeholder="Enter title"
            title="Enter your title"
          />
          <input
            {...register("description")}
            type="text"
            className="w-full focus:outline-[#5B2333] mt-2 border p-2 rounded-md"
            placeholder="Enter description"
            title="Enter your description"
          />
          <button
            title="Add your tasks"
            className="bg-[#5B2333] text-[#F7F4F3] px-3 py-1 mt-2 rounded-lg font-mono font-bold text-lg"
          >
            {load ? (
              <div className="flex items-center gap-1">
                <h1>Adding task</h1>
                <div className="loader"></div>
              </div>
            ) : (
              "Add Task"
            )}
          </button>
        </form>
        {todos.filter((todo) =>
          isSignedIn ? todo.createdBy === user.username : true
        ).length > 0 ? (
          <h1 className="font-semibold text-xl text-[#2E382E] sm:text-2xl my-2 text-center">
            Your tasks
          </h1>
        ) : (
          <h1 className="font-bold text-[#2E382E] font-mono tracking-tighter text-xl sm:text-2xl my-2 text-center">
            Your task list is waiting to be filled
          </h1>
        )}
        <div title="Task list" className="flex flex-col-reverse">
          {todos
            .filter((todo) =>
              isSignedIn ? todo.createdBy === user.username : true
            )
            .map((todo) => (
              <Card
                title={todo.title}
                desc={todo.desc}
                del={deletehandler}
                key={todo.id}
                id={todo.id}
                status={todo.status}
              />
            ))}
        </div>
        <div
          className={
            notification
              ? "absolute sm:top-20  sm:right-10 hidden sm:block rounded-md border transition-all scale-1 bg-green-100 p-2 text-green-600 border-green-600 font-bold font-mono text-lg"
              : "absolute top-20 text-green-600 hidden sm:block right-10 border transition-all scale-0 bg-green-100 p-2 rounded-md border-green-600 font-bold font-mono text-lg"
          }
        >
          Task added successfully!
        </div>
        <h1
          className={
            deleteStatus
              ? "absolute text-red-600 top-16 h-8 hidden sm:block left-[45%] border items-center transition-all scale-1 bg-red-100 px-4 py-2 rounded-full border-red-600 font-bold font-mono text-sm"
              : "absolute top-16 h-8 left-[45%] text-red-600 hidden sm:block border transition-all scale-0 bg-red-100 px-4 py-2 rounded-full border-red-600 font-bold font-mono text-sm"
          }
        >
          Task deleted successfully
        </h1>
      </SignedIn>
      <SignedOut>
        <div className="sm:w-[560px] w-[90%] absolute top-1/2 left-1/2 translate-x-[-50%] overflow-hidden text-pretty translate-y-[-50%] mx-auto">
        <BlurFade delay={0.25} inView>
          <h1 className="sm:text-3xl text-center text-[#5B2333] text-2xl font-black">
          Simplify, Organize, Accomplish.
          </h1>
          <p className=" text-[#2E382E] font-semibold text-center text-lg">
            Streamline your day and focus on what matters most. Our intuitive
            to-do app helps you prioritize, organize, and tackle your tasks with
            ease.
          </p>
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
