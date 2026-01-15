import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Lists from "./pages/Lists";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout"; //
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import { useState } from "react"; 
import api from "./api/axios";
import ModalForm from "./components/ModalForm";
import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOpenProfile = () => {
  api.get("/user")
    .then((res) => {
      setUserData({ ...res.data.data, password: "" });
      setShowProfileModal(true);
    })
    .catch((err) => console.error("Error fetching user:", err));
};

const handleUpdateProfile = (data) => {
  const payload = { ...data };

  if (!payload.password || payload.password.trim() === "") {
    delete payload.password;
  }

  api.put("/user", payload)
    .then(() => {
      alert("Profile updated successfully!");
      setShowProfileModal(false);
    })
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        console.error("Validation errors:", err.response.data.errors);
        alert("Please check your input (e.g., email might be taken).");
      } else {
        console.error("Server Error:", err);
        alert("A server error occurred (500).");
      }
    });
};

  const showSidebar = location.pathname === "/" || location.pathname === "/tasks" || location.pathname === "/lists";

  const hideUI = ["/login", "/register", "/logout"].includes(location.pathname);

  return (
    <div  className="app-container" style={{  backgroundColor: "#000", 
}}   >
      {showSidebar && (
        <>
          <Sidebar onMyAccountClick={handleOpenProfile} />
          
          {showProfileModal && (
  <ModalForm title="My Account"
    fields={[
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "password", label: "Change Password", type: "password" },
    ]}
    initialData={userData}
    onSubmit={handleUpdateProfile} 
    onClose={() => setShowProfileModal(false)}
  />
)}
        </>
      )}
       <main className="main-content">
        {!hideUI && <Breadcrumbs />}

        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} /> 
        </Routes>
      </main>
    </div>
  );
}

export default App;
