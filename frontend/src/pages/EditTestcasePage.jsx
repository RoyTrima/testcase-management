import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTestcasePage({ token }) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestcase = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/testcases/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to fetch testcase");
          return;
        }
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTestcase();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/testcases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, status })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update testcase");
        return;
      }

      navigate("/testcases");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1 className="text-2xl font-bold mb-4">Edit Testcase</h1>
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
        <button type="submit" className="bg-green-500 text-white p-2 rounded mt-2">
          Update
        </button>
      </form>
    </div>
  );
}
