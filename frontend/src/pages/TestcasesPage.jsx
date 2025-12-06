import TestcaseList from "./TestcaseList";
import { Link } from "react-router-dom";

export default function TestcasesPage() {
  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testcases</h1>

        <Link
          to="/testcases/add"
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          + Add Testcase
        </Link>
      </div>

      <TestcaseList />
    </div>
  );
}
