import { useEffect, useState } from "react";

export default function DashboardLayout({ children, token, onSelectSuite }) {
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
  
    const PROJECT_ID = 1;
  
    fetch(`/api/suites/project/${PROJECT_ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status} - ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          setSuites(data);
        })
        .catch((err) => {
          console.error("Failed load suites:", err);
            
      });
  }, [token]);
  

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">TestRail Clone</h2>

        <p className="text-sm text-gray-400 mb-2">Select suite</p>

        {loading && <p className="text-gray-500">Loading...</p>}

        {suites.map((suite) => (
          <button
            key={suite.id}
            onClick={() => onSelectSuite(suite)}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          >
            {suite.name}
          </button>
        ))}
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
