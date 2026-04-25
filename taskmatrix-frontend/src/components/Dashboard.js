import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
// load stripe
console.log("Stripe Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const token = localStorage.getItem("token");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // FETCH TASKS
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  }, [token]);
  // Call it when page loads
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ADD TASK
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title: newTask },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update UI instantly
      setTasks([...tasks, res.data]);
      setNewTask("");

    } catch (err) {
      console.log("Error adding task:", err);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Remove from UI instantly
      setTasks(tasks.filter((task) => task._id !== id));

    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };
  // HANDLE PAYMENT
  const handlePayment = async () => {
   console.log("Payment button clicked"); // ADD
   try {
    const res = await axios.post(
      "http://localhost:5000/api/payment/create-checkout-session"
    );

    console.log("Session:", res.data); // ADD

    // get stripe instance
    const stripe = await stripePromise;
    if (!stripe) {
      console.log("Stripe failed to load");
      return;
    }

    // redirect
    window.location.href = res.data.url;

  } catch (err) {
    console.log("Payment error:", err.response?.data || err.message);
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handlePayment}>Upgrade to Pro 💳</button>
        
      <hr />

      {/*Add Task */}
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={addTask}>Add Task</button>

      <hr />

      {/*Task List */}
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