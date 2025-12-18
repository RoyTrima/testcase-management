import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import SuitesPage from "./pages/SuitesPage";
import TestcasesPage from "./pages/TestcasesPage";
import AddTestcasePage from "./pages/AddTestcasePage";
import EditTestcasePage from "./pages/EditTestcasePage";

export default function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
    console.log("User logged in! Token:", jwtToken);
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

      {/* step 1: project list */}
      <Route path="/projects" element={<ProjectsPage token={token} />} />

      {/* step 2: suite list */}
      <Route path="/projects/:projectId/suites" element={<SuitesPage token={token} />} />

      {/* step 3: testcase list */}
      <Route path="/suites/:suiteId/testcases" element={<TestcasesPage token={token} />} />

      {/* add/edit testcase */}
      <Route path="/suites/:suiteId/testcases/add" element={<AddTestcasePage token={token} />} />
      <Route path="/suites/:suiteId/testcases/edit/:testcaseId" element={<EditTestcasePage token={token} />} />
    </Routes>
  );
}
