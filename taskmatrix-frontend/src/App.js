import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Payment Routes */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

      </Routes>
    </Router>
  );
}

export default App;