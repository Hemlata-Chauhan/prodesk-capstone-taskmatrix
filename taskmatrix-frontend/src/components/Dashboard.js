import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
//import { loadStripe } from "@stripe/stripe-js";

// Stripe setup
//const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // AI state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // helper to keep headers consistent
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // FETCH TASKS
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        getAuthHeaders()
      );

      // supports both shapes: { data: [...] } or [...]
      const list = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setTasks(list);
    } catch (err) {
      console.log("Error fetching tasks:", err.response?.data || err.message);
    }
  }, [token]); // eslint-disable-line

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ADD TASK
  const addTask = async () => {
    if (!newTask.trim()) return;

    console.log("Add button clicked");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title: newTask },
        getAuthHeaders()
      );

      console.log("Response:", res.data);

      // normalize response: either { data: task } or task
      const createdTask = res.data.data || res.data;

      // update state safely
      setTasks((prev) => [...prev, createdTask]);

      setNewTask("");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log("Error:", err.response?.data || err.message);
    }
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        getAuthHeaders()
      );

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.log("Error deleting task:", err.response?.data || err.message);
    }
  };

  // FILTER TASKS FOR KANBAN
  const todo = tasks.filter((t) => t.status === "todo");
  const progress = tasks.filter((t) => t.status === "inprogress");
  const done = tasks.filter((t) => t.status === "done");

  // TASK CARD UI
  const TaskCard = ({ task }) => (
    <div
      style={{
        background: "#fff",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h4>{task.title}</h4>
      <p style={{ fontSize: "12px", color: "#555" }}>
        {task.description || "No description"}
      </p>

      {/* Priority badge */}
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "5px",
          fontSize: "12px",
          background:
            task.priority === "high"
              ? "#ef4444"
              : task.priority === "medium"
                ? "#f59e0b"
                : "#10b981",
          color: "#fff"
        }}
      >
        {task.priority || "low"}
      </span>

      <br />

      <button
        onClick={() => deleteTask(task._id)}
        style={{
          marginTop: "8px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px"
        }}
      >
        Delete
      </button>
    </div>
  );


  // PAYMENT
  const handlePayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session"
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.log("Payment error:", err.response?.data || err.message);
    }
  };

  // AI
  const getAI = async () => {
    if (!aiPrompt.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/suggest",
        { prompt: aiPrompt }
      );

      setAiResult(res.data.suggestion);
    } catch (err) {
      console.log("AI error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo img"><img
          src="/taskmatrixlogoB.png"
          alt="TaskMatrix Logo"
        /></div>

        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">My Tasks</div>
        <div className="nav-item">Team</div>
        <div className="nav-item">Settings</div>

        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <input className="search" placeholder="Search..." />

          <div className="top-icons">
            🔔
            👤
          </div>
        </div>

        {/* ADD TASK */}
        <div className="add-task">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task"
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* BOARD */}
        <div className="board">

          {/* TODO */}
          <div className="column">
            <h3>To Do</h3>
            {tasks.filter(t => t.status === "todo").map(task => (
              <div key={task._id} className="card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>

                <span className={`badge ${task.priority || "low"}`}>
                  {task.priority || "low"}
                </span>

                <br />

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* IN PROGRESS */}
          <div className="column">
            <h3>In Progress</h3>
            {tasks.filter(t => t.status === "inprogress").map(task => (
              <div key={task._id} className="card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>

                <span className={`badge ${task.priority || "medium"}`}>
                  {task.priority || "medium"}
                </span>
              </div>
            ))}
          </div>

          {/* DONE */}
          <div className="column">
            <h3>Done</h3>
            {tasks.filter(t => t.status === "done").map(task => (
              <div key={task._id} className="card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>

                <span className="badge low">done</span>
              </div>
            ))}
          </div>

        </div>
        <div style={{ padding: "20px" }}>
          <h3>AI Suggestions 🤖</h3>

          <input
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask AI..."
          />
          <button onClick={getAI}>Generate</button>

          {aiResult && <p>{aiResult}</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;