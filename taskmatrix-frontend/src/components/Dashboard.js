import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={handlePayment}>Upgrade to Pro 💳</button>

      <hr />

      {/* ADD TASK */}
      <h3>Add Task</h3>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={addTask}>Add Task</button>

      <hr />

      {/* AI SECTION */}
      <h3>AI Task Suggestions 🤖</h3>

      <input
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        placeholder="Ask AI (e.g. give me task ideas)"
        style={{ width: "300px", marginRight: "10px" }}
      />

      <button onClick={getAI}>Generate</button>

      {aiResult && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            background: "#f9fafb"
          }}
        >
          <strong>AI Suggestion:</strong>
          <p>{aiResult}</p>
        </div>
      )}

      <hr />

      {/* TASK LIST */}
      <h3>Your Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px"
            }}
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;