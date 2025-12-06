import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import TestcasesPage from "./pages/TestcasesPage";
import AddTestcasePage from "./pages/AddTestcasePage";
import EditTestcasePage from "./pages/EditTestcasePage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/testcases" element={token ? <TestcasesPage token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/testcases/add" element={token ? <AddTestcasePage token={token} /> : <Navigate to="/login" />} />
        <Route path="/testcases/edit/:id" element={token ? <EditTestcasePage token={token} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/testcases" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
