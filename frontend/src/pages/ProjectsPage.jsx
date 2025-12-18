import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {projects.map((p) => (
        <div
          key={p.id}
          className="border p-3 mb-2 rounded cursor-pointer"
          onClick={() => navigate(`/projects/${p.id}/suites`)}
        >
          {p.name}
        </div>
      ))}
    </div>
  );
}
