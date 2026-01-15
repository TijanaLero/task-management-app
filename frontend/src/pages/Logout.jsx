import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged!");
        console.warn("Theres no token- back to login");
        navigate("/login");
        return;
      }

      try {
        await api.post("/logout");
        console.log("Logout uspešan");
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn("Account not autentificated.");
        } else {
          console.error("Error", err);
        }
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    };

    performLogout();
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ff8fa3",
        fontSize: "1.2rem",
      }}
    >
      Logging out...
    </div>
  );
}
