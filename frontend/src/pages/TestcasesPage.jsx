import { useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import {
  getTestcases,
  importTestcases,
  exportTestcases,
} from "../services/testcaseService";

export default function TestcasesPage({ token }) {
  const [suiteId, setSuiteId] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [previewRows, setPreviewRows] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // dipanggil oleh Sidebar
  const handleSelectSuite = async (suite) => {
    setSuiteId(suite.id);
    await loadTestcases(suite.id);
  };

  const loadTestcases = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await getTestcases(id);
      setTestcases(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

    // =====================
  // CSV PREVIEW PARSER
  // =====================
  const parseCsvPreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const lines = reader.result.split("\n").filter(Boolean);
        const headers = lines[0].split(",").map(h => h.trim());

        const rows = lines.slice(1).map((line, idx) => {
          const values = line.split(",");
          const row = {};
          headers.forEach((h, i) => {
            row[h] = values[i]?.trim();
          });

          return {
            rowNumber: idx + 2,
            ...row,
            _status: row.id ? "UPDATE" : "INSERT",
          };
        });

        resolve(rows);
      };

      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  //NewChecklist
  const toggleSelectAll = () => {
    if (selectedIds.length === testcases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testcases.map(tc => tc.id));
    }
  };
  
  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };
  

  // =====================
  // IMPORT CSV
  // =====================
  const handleImport = async () => {
    if (!suiteId) {
      alert("Please select a suite first");
      return;
    }

    if (!file) {
      alert("Please choose CSV file");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await importTestcases(suiteId, file);

      setMessage(
        `Import done. Inserted: ${res.data.inserted}, Updated: ${res.data.updated}, Skipped: ${res.data.skipped}`
      );

      loadTestcases(suiteId);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // EXPORT CSV
  // =====================
  const handleExport = async () => {
    if (!suiteId) {
      alert("Please select a suite first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await exportTestcases(suiteId);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "testcases.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      token={token}
      onSelectSuite={handleSelectSuite}
    >

      <h1 className="text-2xl font-bold mb-4">Testcases</h1>

      {!suiteId && (
        <p className="text-gray-500 mb-4">
          Please select a suite from sidebar
        </p>
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {/* ACTION BAR */}
      {suiteId && (
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Export CSV
          </button>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={async () => {
              if (!file) {
                alert("Choose CSV first");
                return;
              }
              const rows = await parseCsvPreview(file);
              setPreviewRows(rows);
              setShowPreview(true);
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Preview Import
          </button>

          <button
            onClick={handleImport}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Import CSV
          </button>

          <Link
             to={`/suites/${suiteId}/testcases/add`}
             className="add-testcase"
          >
            + Add Testcase
          </Link>
        </div>
      )}
      {showPreview && (
        <div className="border rounded mb-4">
          <h2 className="font-semibold p-3 border-b">
            Import Preview ({previewRows.length} rows)
          </h2>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Row</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r) => (
                <tr key={r.rowNumber}>
                  <td className="p-2 border text-center">{r.rowNumber}</td>
                  <td className="p-2 border">{r.title}</td>
                  <td className="p-2 border text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        r._status === "UPDATE"
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                    >
                      {r._status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 flex gap-3">
            <button
              onClick={handleImport}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm Import
            </button>

            <button
              onClick={() => setShowPreview(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {/* TESTCASE TABLE */}
      {suiteId && !loading && (
        <table className="tc-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={
                    testcases.length > 0 &&
                    selectedIds.length === testcases.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={{ width: "60px" }}>ID</th>
              <th>Title</th>
              <th style={{ width: "120px" }}>Status</th>
              <th style={{ width: "100px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {testcases.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No testcases found
                </td>
              </tr>
            )}

            {testcases.map((tc) => (
              <tr key={tc.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tc.id)}
                    onChange={() => toggleSelectOne(tc.id)}
                  />
                </td>
                <td>{tc.id}</td>

                <td>
                  <Link
                    to={`/suites/${suiteId}/testcases/edit/${tc.id}`}
                    className="tc-link"
                  >
                    {tc.title}
                  </Link>
                </td>

                <td>
                  <span className={`tc-status ${tc.status || "draft"}`}>
                    {tc.status || "Draft"}
                  </span>
                </td>

                <td>
                  <Link
                    to={`/suites/${suiteId}/testcases/edit/${tc.id}`}
                    className="tc-action"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}
