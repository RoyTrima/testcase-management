import { useEffect, useState } from "react";

export default function TestcaseList() {
  const [testcases, setTestcases] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/testcases")
      .then((res) => res.json())
      .then((data) => setTestcases(data))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testcase?")) return;

    await fetch(`http://localhost:4000/api/testcases/${id}`, {
      method: "DELETE",
    });

    setTestcases(testcases.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Testcases
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left border-b">
              <th className="p-3 font-semibold text-gray-700">ID</th>
              <th className="p-3 font-semibold text-gray-700">Title</th>
              <th className="p-3 font-semibold text-gray-700">Description</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {testcases.map((tc) => (
              <tr key={tc.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{tc.id}</td>
                <td className="p-3 font-medium text-gray-800">{tc.title}</td>
                <td className="p-3 text-gray-700">{tc.description}</td>

                <td className="p-3">
                  <span
                    className={
                      tc.status === "PASSED"
                        ? "px-2 py-1 text-sm bg-green-100 text-green-700 rounded-lg"
                        : "px-2 py-1 text-sm bg-red-100 text-red-700 rounded-lg"
                    }
                  >
                    {tc.status}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/testcases/edit/${tc.id}`)
                    }
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(tc.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {testcases.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No testcases found.
          </p>
        )}
      </div>
    </div>
  );
}
