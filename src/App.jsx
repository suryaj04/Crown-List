import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "./Card";

export default function App() {
  let { register, handleSubmit, reset } = useForm();
  let [todos, setTodos] = useState([]);
  let [form, setForm] = useState(false);
  let [notification, setNotification] = useState(false);
  let [deleteStatus, setDelete] = useState(false);
  let api =
    "https://todos-eb5ee-default-rtdb.asia-southeast1.firebasedatabase.app/";
  function submitHandler(data) {
    setForm(true);
    axios
      .post(`${api}todos.json`, { title: data.title, desc: data.desc })
      .then(() => {
        setForm(false);
        setNotification(true);
        setTimeout(() => {
          setNotification(false);
        }, 1500);
      });
    reset();
  }
  function handleDelete(id) {
    setDelete(false)
    axios.delete(`${api}todos/${id}.json`).then(() => {
      setDelete(true);
      setTimeout(() => {
        setDelete(false);
      }, 1500);
      fetchTodo();
    });
  }
  function fetchTodo() {
    axios.get(`${api}todos.json`).then((todos) => {
      fetchTodo();
      let temp = [];
      for (let key in todos.data) {
        let todo = {
          id: key,
          ...todos.data[key],
        };
        temp.push(todo);
      }
      setTodos(temp);
    });
  }
  useEffect(() => {
    fetchTodo();
  }, []);
  return (
    <div>
      <form
        action=""
        className="w-96 mx-auto my-20 rounded-md p-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="font-bold text-xl ">
          Manage your tasks <span className="text-neutral-600">@Surya</span>
        </h1>
        <input
          type="text"
          required
          {...register("title")}
          placeholder="Enter title"
          className="w-full p-1 border my-2 border-black rounded-md"
        />
        <input
          type="text"
          required
          {...register("desc")}
          className="w-full p-1 border mb-2 border-black rounded-md"
          placeholder="Enter desc"
        />
        <button className="bg-black text-white mx-auto px-5 py-2 rounded-md  font-mono font-bold text-lg ">
          {form ? <div className="loader1"></div> : "Submit"}
        </button>
      </form>
      <div className="flex flex-col-reverse">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            id={todo.id}
            handleDelete={handleDelete}
            title={todo.title}
            desc={todo.desc}
          />
        ))}
      </div>
      <div
        className={
          notification
            ? "w-96 right-5 shadow-md transition-all scale-1 text-center p-2  bg-green-100 text-green-600 top-2 text-lg absolute border-black font-bold font-mono"
            : "w-96 right-5 shadow-md scale-0 text-center p-2 transition-all  bg-green-100  top-2 text-lg absolute border-black font-bold font-mono"
        }
      >
        <h1>Task added successfully!</h1>
      </div>
      <div
        className={
          deleteStatus
            ? "w-96 left-5 shadow-md transition-all  scale-1 text-center p-2  bg-red-100 text-red-600  top-2 text-lg absolute border-black font-bold font-mono"
            : "w-96 left-5 shadow-md scale-0 text-center p-2 transition-all  bg-green-100  top-2 text-lg absolute border-black font-bold font-mono"
        }
      >
        <h1>Task deleted successfully!</h1>
      </div>
    </div>
  );
}
