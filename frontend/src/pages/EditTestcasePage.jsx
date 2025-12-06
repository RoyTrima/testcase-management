import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTestcasePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    fetch(`http://localhost:4000/api/testcases/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:4000/api/testcases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    navigate("/testcases");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Testcase</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md border"
      >
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded-lg"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded-lg"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            className="w-full p-2 border rounded-lg"
            value={form.status}
            onChange={handleChange}
          >
            <option value="PASSED">PASSED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Update
        </button>
      </form>
    </div>
  );
}
