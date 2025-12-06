export default function TestcaseList({ testcases, token, refresh }) {
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this testcase?")) return;
      await fetch(`http://localhost:4000/api/testcases/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      refresh();
    };
  
    return (
      <div>
        {testcases.map(tc => (
          <div key={tc.id} className="p-4 border rounded mb-2 flex justify-between">
            <div>
              <strong>{tc.title}</strong>
              <p>{tc.description}</p>
            </div>
            <div>
              <Link to={`/testcases/edit/${tc.id}`}>
                <button className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
              </Link>
              <button onClick={() => handleDelete(tc.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  