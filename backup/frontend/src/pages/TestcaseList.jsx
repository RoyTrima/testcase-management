import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TestcaseList() {
  const [testcases, setTestcases] = useState([]);

  // Fetch data dari backend
  useEffect(() => {
    fetch("http://localhost:4000/api/testcases")
      .then((res) => res.json())
      .then((data) => setTestcases(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testcase List</h1>

        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          + New Testcase
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {testcases.map((tc) => (
              <tr key={tc.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{tc.id}</td>
                <td className="p-3 font-medium">{tc.title}</td>
                <td className="p-3">{tc.description}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      tc.status === "PASSED"
                        ? "bg-green-600"
                        : tc.status === "FAILED"
                        ? "bg-red-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {tc.status}
                  </span>
                </td>

                <td className="p-3 flex gap-3">
                  <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Edit
                  </button>

                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {testcases.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No testcases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TestcaseList;
