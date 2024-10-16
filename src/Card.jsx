import React, { useState } from "react";

export default function Card({ title, desc, handleDelete, id }) {
  let [deleteStatus, setDelete] = useState(false);
  function deleteHandler() {
    setDelete(true);
    handleDelete(id);
  }
  return (
    <div className="w-96 mx-auto mt-2 p-2 border items-center flex justify-between rounded-md border-black">
      <div>
        <h1 className="font-semibold text-lg">{title}</h1>
        <h1 className="font-semibold">{desc}</h1>
      </div>
      <button onClick={deleteHandler} className="font-bold">
        {deleteStatus ? (
          <span className="loader"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi text-red-600 bi-trash"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        )}
      </button>
    </div>
  );
}
