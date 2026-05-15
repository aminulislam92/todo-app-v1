import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase.config";

const App = () => {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Realtime Fetch
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      // Pending sync check
      console.log(snapshot.metadata.hasPendingWrites);
      setIsSyncing(snapshot.metadata.hasPendingWrites);

      const allTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(allTasks);
    });

    return () => unsubscribe();
  }, []);

  // Add Task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await addDoc(collection(db, "tasks"), {
        text,
        completed: false,
        createdAt: Date.now(),
      });

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.log(error);
    }
  };
  // Update Task

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Todo App</h1>
        <p className="text-gray-600 text-center mb-4">
          Add tasks and they will be saved in real-time! Try adding tasks while
          offline and see them sync when you go back online.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="Add task"
            className="border border-gray-300 focus:outline-none focus:border-blue-500 p-2 flex-1 rounded"
          />

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded cursor-pointer">
            Add
          </button>
        </form>
        <p>{isSyncing ? "Saving..." : "Synced"}</p>

        <div className="mt-5 space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border-b border-gray-300 p-2 flex justify-between items-center"
            >
              <span
                onClick={() => handleToggle(task)}
                className={`cursor-pointer ${task.completed ? "line-through text-gray-400" : ""}`}
              >
                {`${tasks.indexOf(task) + 1}. `} {task.text}
              </span>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:underline hover:text-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
