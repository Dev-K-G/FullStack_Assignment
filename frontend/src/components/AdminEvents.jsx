import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
  title: "",
  description: "",
  date: "",
  time: "",
  venue: ""
});

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5001/api/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async () => {
    await axios.post("http://localhost:5001/api/events", form);
    fetchEvents();
    //sendNotification(form.title);
  };

  const deleteEvent = async (id) => {
    await axios.delete(`http://localhost:5001/api/events/${id}`);
    fetchEvents();
  };

  return (
    <div>
      <h2>Admin Events</h2>

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        placeholder="Date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <input
        placeholder="Time"
        type="time"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
      />

      <input
        placeholder="Venue"
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
      />

      <select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}>
        <option value="Tech Talk">Tech Talk</option>
        <option value="Workshop">Workshop</option>
        <option value="Seminar">Seminar</option>
      </select>

      <button onClick={createEvent}>Create</button>

      <ul>
        {events.map((ev) => (
          <li key={ev._id}>
            {ev.title}
            <button onClick={() => deleteEvent(ev._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}