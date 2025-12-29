import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTestcasePage({ token }) {
  const { testcaseId, suiteId } = useParams();

  const [title, setTitle] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!testcaseId) return;

    const fetchTestcase = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/testcases/${testcaseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch testcase");
          return;
        }

        setTitle(data.title || "");
        setExpectedResult(data.expected_result || "");
        setStatus(data.status || "draft");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTestcase();
  }, [testcaseId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:4000/api/testcases/${testcaseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            expected_result: expectedResult,
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update testcase");
        return;
      }

      // balik ke list testcase suite
      navigate(`/suites/${suiteId}/testcases`);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Delete this testcase?")) return;
  
    try {
      const res = await fetch(
        `http://localhost:4000/api/testcases/${testcaseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete");
        return;
      }
  
      navigate(`/suites/${suiteId}/testcases`);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Testcase</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <label className="block text-sm font-medium mb-1">
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Expected Result
    </label>
    <textarea
      rows={3}
      value={expectedResult}
      onChange={(e) => setExpectedResult(e.target.value)}
      className="w-full border rounded px-3 py-2 resize-none"
    />
  </div>

  <div className="w-48">
    <label className="block text-sm font-medium mb-1">
      Status
    </label>
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      <option value="draft">TODO</option>
      <option value="PASSED">PASSED</option>
      <option value="FAILED">FAILED</option>
    </select>
  </div>

  <div className="flex gap-3 pt-2">
    <button className="bg-green-600 text-white px-4 py-2 rounded">
      Update
    </button>

    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
  </div>

</form>

    </div>
  );
}
