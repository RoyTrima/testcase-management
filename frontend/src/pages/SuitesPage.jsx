import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SuitesPage() {
  const { projectId } = useParams();
  const [suites, setSuites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/projects/${projectId}/suites`)
      .then((res) => res.json())
      .then(setSuites)
      .catch(console.error);
  }, [projectId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4">Suites</h1>

      {suites.map((s) => (
        <div
          key={s.id}
          className="border p-3 mb-2 rounded cursor-pointer"
          onClick={() => navigate(`/suites/${s.id}/testcases`)}
        >
          {s.name}
        </div>
      ))}
    </div>
  );
}
