import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "./Card";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";

export default function App() {
  let { register, handleSubmit, reset } = useForm();
  let [todos, setTodos] = useState([]);
  let [notification, setNotification] = useState(false);
  let [load, setLoad] = useState(false);
  let [deleteStatus, setDeleteStatus] = useState(false);
  let {user} = useUser()
  let {isSignedIn} = useAuth()
  let api =
    "https://todos-eb5ee-default-rtdb.asia-southeast1.firebasedatabase.app/";
  function submit(data) {
    setLoad(true);
    axios
      .post(`${api}todos.json`, {
        title: data.title,
        desc: data.description,
        createdBy: user.username,
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
      <div className="border-b p-3">
      <header className="w-[900px] flex justify-between items-center mx-auto">
        <h1 className="font-bold text-3xl font-mono">CrownList</h1>
      <SignedIn>
        <UserButton  />
      </SignedIn>
      <SignedOut>
        <SignInButton  />
      </SignedOut>
    </header>
      </div>
      <SignedIn>
        <form
          action=""
          className="w-96 mx-auto p-2 mt-5"
          onSubmit={handleSubmit(submit)}
        >
          <h1 className="font-bold text-2xl">
            Manage your tasks <span className="text-neutral-600 text-2xl">@{isSignedIn ? user.firstName : ''}</span>
          </h1>
          <input
            required
            {...register("title")}
            type="text"
            className="w-full mt-2 border p-2 rounded-md"
            placeholder="Enter title"
          />
          <input
            required
            {...register("description")}
            type="text"
            className="w-full mt-2 border p-2 rounded-md"
            placeholder="Enter description"
          />
          <button
            title="Add your tasks over here"
            className="bg-black px-3 py-1.5 mt-2 rounded-md font-mono text-white font-bold text-lg"
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
      {
        todos.filter(todo=> isSignedIn ? todo.createdBy===user.username : true).length > 0 ?  <h1 className="font-bold font-mono text-2xl my-2 text-center">
        Your Tasks
      </h1> : <h1 className="font-bold font-mono tracking-tighter text-2xl my-2 text-center">
      Add task to see them here
      </h1>
      }
      <div className="flex flex-col-reverse">
        {todos.filter(todo=>isSignedIn ? todo.createdBy === user.username : true).map((todo) => (
          <Card
            title={todo.title}
            desc={todo.desc}
            del={deletehandler}
            key={todo.id}
            id={todo.id}
          />
        ))}
      </div>
      <div
        className={
          notification
            ? "absolute top-20 right-10 rounded-md border transition-all scale-1 bg-green-100 p-2 text-green-600 border-green-600 font-bold font-mono text-lg"
            : "absolute top-20 text-green-600 right-10 border transition-all scale-0 bg-green-100 p-2 rounded-md border-green-600 font-bold font-mono text-lg"
        }
      >
        Task added successfully!
      </div>
      <div
        className={
          deleteStatus
            ? "absolute text-red-600 top-20 left-10 border transition-all scale-1 bg-red-100 p-2 rounded-md border-red-600 font-bold font-mono text-lg"
            : "absolute top-20 left-10 text-red-600 border transition-all scale-0 bg-red-100 p-2 rounded-md border-red-600 font-bold font-mono text-lg"
        }
      >
        Task deleted successfully
      </div>
      </SignedIn>
    </div>
  );
}
