import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div>
        <h1>TaskMatrix</h1>

        {/* Navigation */}
        <nav>
          <Link to="/">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route */}
           <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        </Routes>
      </div>
    </Router>
  );
}

export default App;