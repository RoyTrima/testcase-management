import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTestcasePage({ token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/testcases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, status })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create testcase");
        return;
      }

      navigate("/testcases");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1 className="text-2xl font-bold mb-4">Add Testcase</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
          <option value="draft">Draft</option>
          <option value="PASSED">PASSED</option>
          <option value="FAILED">FAILED</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          Add
        </button>
      </form>
    </div>
  );
}
