import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TestcasesPage() {
  const [projects, setProjects] = useState([]);
  const [suites, setSuites] = useState([]);
  const [testcases, setTestcases] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch projects
  useEffect(() => {
    if (!token) {
      setError("No token found. Please login first.");
      return;
    }

    fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return setError(data.error || "Failed to fetch projects");

        setProjects(data);

        if (data.length > 0) {
          loadSuites(data[0].id);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const loadSuites = (projectId) => {
    fetch(`/api/projects/${projectId}/suites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return setError(data.error || "Failed to fetch suites");

        setSuites(data);

        if (data.length > 0) {
          loadTestcases(data[0].id);
        }
      })
      .catch((err) => setError(err.message));
  };

  const loadTestcases = (suiteId) => {
    fetch(`/api/suites/${suiteId}/testcases`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return setError(data.error || "Failed to fetch testcases");

        setTestcases(data);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h1 className="text-2xl font-bold mb-4">Testcases</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Dropdown Projects */}
      <label>Project:</label>
      <select
        onChange={(e) => loadSuites(e.target.value)}
        className="border p-2 rounded ml-2"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Dropdown Suites */}
      <label className="ml-4">Suite:</label>
      <select
        onChange={(e) => loadTestcases(e.target.value)}
        className="border p-2 rounded ml-2"
      >
        {suites.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <Link
        to="/testcases/add"
        className="bg-green-500 text-white p-2 rounded ml-4"
      >
        Add New Testcase
      </Link>

      <ul className="mt-4">
        {testcases.map((t) => (
          <li key={t.id} className="p-2 border-b">
            <Link to={`/testcases/edit/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
