import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    event: "Tech Talk"
  });

  const [errors, setErrors] = useState({});

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5001/api/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const validate = () => {
    let newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.venue.trim()) newErrors.venue = "Venue is required";

    return newErrors;
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      event: "Tech Talk"
    });
    setErrors({});
  };

  const createEvent = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await axios.post("http://localhost:5001/api/events", form);

    fetchEvents();
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
  };

  // 🔁 SELECT ALL LOGIC
  const handleSelectAll = () => {
    if (selected.length === events.length) {
      setSelected([]);
    } else {
      setSelected(events.map((ev) => ev._id));
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const deleteSelected = async () => {
    await Promise.all(
      selected.map((id) =>
        axios.delete(`http://localhost:5001/api/events/${id}`)
      )
    );

    setSelected([]);
    fetchEvents();
  };

  // 🆕 CANCEL SELECTED (NEW)
  const cancelSelected = () => {
    setSelected([]);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const isValid =
    form.title &&
    form.description &&
    form.date &&
    form.time &&
    form.venue &&
    Object.values(errors).every((e) => !e);

  return (
    <div className="container py-4">

      {/* FORM */}
      <div className="card p-4 shadow mb-4">
        <h3 className="text-center mb-3">Admin Events</h3>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <small className="text-danger">{errors.title}</small>}

        <input
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors.description && <small className="text-danger">{errors.description}</small>}

        <input
          className="form-control mb-2"
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
        {errors.date && <small className="text-danger">{errors.date}</small>}

        <input
          className="form-control mb-2"
          type="time"
          value={form.time}
          onChange={(e) => handleChange("time", e.target.value)}
        />
        {errors.time && <small className="text-danger">{errors.time}</small>}

        <input
          className="form-control mb-2"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => handleChange("venue", e.target.value)}
        />
        {errors.venue && <small className="text-danger">{errors.venue}</small>}

        <select
          className="form-select mb-3"
          value={form.event}
          onChange={(e) => handleChange("event", e.target.value)}
        >
          <option value="Tech Talk">Tech Talk</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
        </select>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary w-50"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary w-50"
            onClick={createEvent}
            disabled={!isValid}
          >
            Create Event
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow p-3">

        <h4 className="mb-3">Events List</h4>

        <div className="table-responsive">
          <table className="table table-hover align-middle">

            <thead className="table-dark">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.length === events.length && events.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev._id}>

                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(ev._id)}
                        onChange={() => toggleSelect(ev._id)}
                      />
                    </td>

                    <td>{ev.title}</td>
                    <td>{ev.description}</td>
                    <td>{ev.date}</td>
                    <td>{ev.time}</td>
                    <td>{ev.venue}</td>
                    <td>{ev.event}</td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-end gap-2 mt-3">

          <button
            className="btn btn-outline-secondary"
            disabled={selected.length === 0}
            onClick={cancelSelected}
          >
            Cancel Selected
          </button>

          <button
            className="btn btn-danger"
            disabled={selected.length === 0}
            onClick={deleteSelected}
          >
            Delete Selected ({selected.length})
          </button>

        </div>

      </div>
    </div>
  );
}