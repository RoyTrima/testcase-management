import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar({ onSelectSuite }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [suites, setSuites] = useState([]);
  const [activeSuiteId, setActiveSuiteId] = useState(null);
  const [counts, setCounts] = useState({}); // { suiteId: count }

  useEffect(() => {
    api.get("/projects").then((res) => {
      setProjects(res.data);
      if (res.data.length > 0) {
        loadSuites(res.data[0]);
      }
    });
  }, []);

  const loadSuites = async (project) => {
    setActiveProject(project);
    setActiveSuiteId(null);
    const res = await api.get(`/projects/${project.id}/suites`);
    setSuites(res.data);

    // ambil counter per suite
    const map = {};
    await Promise.all(
      res.data.map(async (s) => {
        const tc = await api.get(`/suites/${s.id}/testcases`);
        map[s.id] = tc.data.length;
      })
    );
    setCounts(map);
  };

  const handleSelectSuite = (suite) => {
    setActiveSuiteId(suite.id);
    onSelectSuite(suite);
  };

  return (
    <div className="w-64 bg-gray-100 h-screen p-4 border-r overflow-y-auto">
      <h2 className="font-bold mb-3">Projects</h2>

      {projects.map((p) => (
        <div key={p.id} className="mb-3">
          <div
            className={`cursor-pointer font-semibold ${
              activeProject?.id === p.id ? "text-blue-600" : ""
            }`}
            onClick={() => loadSuites(p)}
          >
            {p.name}
          </div>

          {activeProject?.id === p.id && (
            <ul className="ml-3 mt-2 space-y-1">
              {suites.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleSelectSuite(s)}
                  className={`cursor-pointer px-2 py-1 rounded flex justify-between items-center
                    ${
                      activeSuiteId === s.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200"
                    }`}
                >
                  <span>{s.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeSuiteId === s.id
                        ? "bg-white text-blue-600"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {counts[s.id] ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
