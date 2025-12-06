import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import TestcasesPage from "./pages/TestcasesPage";
import AddTestcasePage from "./pages/AddTestcasePage";
import EditTestcasePage from "./pages/EditTestcasePage";

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link to="/testcases">
            <button>Testcases</button>
          </Link>

          <Link to="/testcases/add" style={{ marginLeft: "10px" }}>
            <button>Add Testcase</button>
          </Link>
        </nav>

        <Routes>
          <Route path="/testcases" element={<TestcasesPage />} />
          <Route path="/testcases/add" element={<AddTestcasePage />} />
          <Route path="/testcases/edit/:id" element={<EditTestcasePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
