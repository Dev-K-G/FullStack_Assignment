import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EventRegistrations() {
  const { eventId } = useParams();
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axios.get(
          `http://localhost:5001/api/events/${eventId}`
        );
        setEvent(eventRes.data);

        const regRes = await axios.get(
          `http://localhost:5001/api/register/${eventId}`
        );
        setUsers(regRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [eventId]);

  // EXPORT FUNCTION
  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/register/export/${eventId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `event_${eventId}_registrations.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("No data to export");
    }
  };

  return (
    <div className="container py-4">
      <h3>Registered Users</h3>

      {event && (
        <div className="mb-3">
          <h5>{event.title}</h5>
          <p className="text-muted">Event ID: {event.eventId}</p>
        </div>
      )}

      {users.length === 0 ? (
        <p>No users registered for this event.</p>
      ) : (
        <>
          {/* Export Button */}
          <button
            className="btn btn-success mb-3"
            onClick={downloadExcel}
          >
            Export to Excel
          </button>

          {/* Table */}
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Notify</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.notify ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}