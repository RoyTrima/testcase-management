import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTestcasePage({ token }) {
  const { suiteId } = useParams(); // ✅ WAJIB
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/testcases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          expected_result: expectedResult,
          status,
          suite_id: suiteId, // ✅ INI KUNCI
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create testcase");
        return;
      }

      // ✅ balik ke suite testcase list
      navigate(`/suites/${suiteId}/testcases`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tc-form">
      <h1>Add Testcase</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Expected Result</label>
        <textarea
          rows={4}
          value={expectedResult}
          onChange={(e) => setExpectedResult(e.target.value)}
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="TODO">Draft</option>
          <option value="PASSED">Passed</option>
          <option value="FAILED">Failed</option>
        </select>

        <button type="submit" className="primary">
          Add Testcase
        </button>
      </form>
    </div>
  );
}
