import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TestcasesPage({ token, onLogout }) {
  const [testcases, setTestcases] = useState([]);

  const fetchTestcases = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/testcases", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setTestcases(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this testcase?")) return;
    try {
      await fetch(`http://localhost:4000/api/testcases/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      fetchTestcases();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTestcases(); }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h1 className="text-2xl font-bold mb-4">Testcases</h1>
      <button onClick={onLogout} className="bg-red-500 text-white p-2 rounded mb-2">Logout</button>
      <Link to="/testcases/add" className="bg-green-500 text-white p-2 rounded mb-4 inline-block">Add Testcase</Link>
      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testcases.map(tc => (
            <tr key={tc.id}>
              <td className="border border-gray-300 p-2">{tc.id}</td>
              <td className="border border-gray-300 p-2">{tc.title}</td>
              <td className="border border-gray-300 p-2">{tc.status}</td>
              <td className="border border-gray-300 p-2">
                <Link to={`/testcases/edit/${tc.id}`} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</Link>
                <button onClick={() => handleDelete(tc.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
