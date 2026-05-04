import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <h4 className="text-center mt-5">Loading...</h4>;

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">Events List</h2>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Venue</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr key={event.eventId}>
              <td>{event.eventId}</td>
              <td>{event.title}</td>
              <td>{event.date}</td>
              <td>{event.time}</td>
              <td>{event.venue}</td>

              <td>
                <Link
                  to={`/events/${event.eventId}/register`}
                  className="btn btn-primary btn-sm"
                >
                  Register
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}