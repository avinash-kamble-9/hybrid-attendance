import { useState, useEffect } from "react";

function App() {
  const [studentId, setStudentId] = useState("");
  const [records, setRecords] = useState([]);

  const backendUrl = "https://your-backend-url.up.railway.app";

  const markAttendance = async (method) => {
    const formData = new FormData();
    formData.append("student_id", studentId);
    formData.append("method", method);

    await fetch(`${backendUrl}/mark_attendance/`, {
      method: "POST",
      body: formData,
    });

    fetchRecords();
    alert("Attendance marked!");
  };

  const fetchRecords = async () => {
    const res = await fetch(`${backendUrl}/attendance_records/`);
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Hybrid Attendance System</h1>
      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />
      <button onClick={() => markAttendance("QR")}>Mark via QR</button>
      <button onClick={() => markAttendance("Code")} style={{ marginLeft: "10px" }}>
        Mark via Code
      </button>

      <h2 style={{ marginTop: "20px" }}>Attendance Records</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Method</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.student_id}</td>
              <td>{r.method}</td>
              <td>{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
