import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* 🔷 Header */}
      <header>
        <img
          src="/taskmatrixlogoA.png"
          alt="TaskMatrix Logo"
          className="logo"
        />
        <p>Organize. Optimize. Achieve.</p>
      </header>

      {/* 🎯 Main Section */}
      <main>
        <h2>Welcome to TaskMatrix</h2>
        <p>Track, manage, and complete tasks effortlessly.</p>

        {/* 🎨 Illustration */}
        <img
          src="/illustration.png"
          alt="Task Illustration"
          className="illustration"
        />

        {/* 🔘 Buttons */}
        <div className="buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </main>

      {/* 🔻 Footer */}
      <footer>
        <p>
          © 2026 TaskMatrix |{" "}
          <button>About</button>
          <button>Privacy</button>
          <button>Contact</button>
        </p>
      </footer>

    </div>
  );
}

export default LandingPage;