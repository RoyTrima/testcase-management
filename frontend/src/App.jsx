import { Routes, Route, Link } from "react-router-dom";
import TestcaseList from "./pages/TestcaseList";
import CreateTestcase from "./pages/CreateTestcase";

function App() {
  return (
    <div className="p-6">

      {/* Navbar Simple */}
      <nav className="mb-6 flex gap-4 border-b pb-4">
        <Link to="/" className="text-blue-600">Testcases</Link>
        <Link to="/create" className="text-blue-600">Create Testcase</Link>
      </nav>

      {/* Routing */}
      <Routes>
        <Route path="/" element={<TestcaseList />} />
        <Route path="/create" element={<CreateTestcase />} />
      </Routes>
    </div>
  );
}

export default App;