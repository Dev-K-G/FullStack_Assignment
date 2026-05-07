import { useEffect, useState } from "react";
//import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/adminEvent.css"; // Import custom CSS for styling
import axios from "../utils/axiosConfig.js";
//import axios from "..../utils/a.js";

export default function AdminEvents() {
  const today = new Date().toISOString().split("T")[0];
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState([]);

  //Search, Filter Table
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const [form, setForm] = useState({    
    title: "",
    description: "",
    date: today,
    time: "00:00",
    venue: "",
    event: "Tech Talk"
  });

  const [errors, setErrors] = useState({});

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5001/api/events");

  const sorted = res.data.sort((a, b) => {
    const dateA = new Date(`${a.date?.slice(0, 10)}T${a.time || "00:00"}`);
    const dateB = new Date(`${b.date?.slice(0, 10)}T${b.time || "00:00"}`);

    return dateA.getTime() - dateB.getTime(); // ascending (new → old)
  });
  setEvents(sorted);


    // setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  //Pagination, Search, Filter
  useEffect(() => {
  setCurrentPage(1);
}, [search, filterType]);

  const validate = () => {
    let newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.date) newErrors.date = "Date is required";
    if (form.date && form.date < today) newErrors.date = "Date cannot be in the past";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.venue.trim()) newErrors.venue = "Venue is required";

    return newErrors;
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: today,
      time: "00:00",
      venue: "",
      event: "Tech Talk"
    });
    setErrors({});
  };

  const createEvent = async () => {
    console.log("Creating event with data:", form);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await axios.post("http://localhost:5001/api/events", form)
    //  .then(res => console.log("SUCCESS:", res.data))
    //  .catch(err => console.log("ERROR:", err.response?.data || err.message));

    alert('Event Created');
    fetchEvents();
    resetForm();
  };

  //EDIT EVENT
const [editingId, setEditingId] = useState(null);
const [editRow, setEditRow] = useState({});
const [editErrors, setEditErrors] = useState({});
const handleEdit = (ev) => {
  setEditingId(ev._id);
  setEditRow({ ...ev });
  setEditErrors({});
};
const handleEditChange = (field, value) => {
  setEditRow({ ...editRow, [field]: value });
  if (editErrors[field]) {
    setEditErrors({ ...editErrors, [field]: "" });
  }
};
//Validation in EDIT ROW
const validateEdit = () => {
  let errors = {};

  if (!editRow.title?.trim()) errors.title = "Required";
  if (!editRow.description?.trim()) errors.description = "Required";
  if (!editRow.date) errors.date = "Required";
    else if (editRow.date < today) errors.date = "Date cannot be in the past";
  if (!editRow.time) errors.time = "Required";
  if (!editRow.venue?.trim()) errors.venue = "Required";

  return errors;
};

//Sear, Filter Table
const filteredEvents = events.filter((ev) => {
  const matchesSearch =
    ev.title?.toLowerCase().includes(search.toLowerCase()) ||
    ev.description?.toLowerCase().includes(search.toLowerCase()) ||
    ev.venue?.toLowerCase().includes(search.toLowerCase()) ||
    ev.eventId?.toString().toLowerCase().includes(search.toLowerCase());

  const matchesType =
    filterType === "All" || ev.event === filterType;

  return matchesSearch && matchesType;
});

//Pagination
const indexOfLast = currentPage * eventsPerPage;
const indexOfFirst = indexOfLast - eventsPerPage;
const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);


//SAVE RowEdit
const saveEdit = async () => {
  const errors = validateEdit();
  setEditErrors(errors);

  if (Object.keys(errors).length > 0) return;

  // Optimistic UI update
  const updatedEvents = events.map((ev) =>
    ev._id === editingId ? { ...editRow } : ev    
  );
editRow.status ="updated";
  setEvents(updatedEvents);
  // try{
  //   updateStatusForSelected("updated");
  // }
  // catch (err) {
  //   console.error(err);
  //   fetchEvents(); // rollback if failed
  // } 
  
  try {
    const {eventId, ...safeData} = editRow; // Exclude eventId from the update payload
    await axios.put(
      `http://localhost:5001/api/events/${editingId}`,
      { ...safeData, status: "updated" }
    );
    // OR
    // await axios.put(
    //   `http://localhost:5001/api/events/${editingId}`,
    //   { ...editRow, status: "updated" }
    // );
    alert('Saved');
  } catch (err) {
    console.error(err);
    fetchEvents(); // rollback if failed
  }

  setEditingId(null);
  setEditRow({});
};

//CANCEL RowEdit
const cancelEdit = () => {
  setEditingId(null);
  setEditRow({});
  setEditErrors({});
};


  const handleCancel = () => {
    resetForm();
  };

  // 🔁 SELECT ALL LOGIC
const handleSelectAll = () => {
  if (selected.length === currentEvents.length) {
    setSelected([]);
  } else {
    setSelected(currentEvents.map((ev) => ev._id));
  }
};

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const deleteSelected = async (action) => {
    await Promise.all(
      selected.map((id) =>
        axios.delete(`http://localhost:5001/api/events/${id}`, { data: { status: action } })
      )
    );

    setSelected([]);
    fetchEvents();
  };

  // 🆕 CANCEL SELECTED (NEW)
  const cancelSelected = () => {
    setSelected([]);
  };

  const updateStatusForSelected = async (selected, status) => {
    try{
      await Promise.all(
    selected.map((_id) =>
      axios.put(`http://localhost:5001/api/events/${_id}`, { ...selected, status })
    )
  );

  setSelected([]);
  fetchEvents();
  alert(`Selected events have been ${status}`);

    }
    catch(err)
    {
      console.error("Error updating status for selected events:", err);
      return;
    }
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

      {/* CREATE EVENT FORM */}
      <div className="card p-4 shadow mb-4">
  <h3 className="text-center mb-3">Admin Events</h3>

  {/* Title */}
  <input
    className="form-control mb-2"
    placeholder="Title"
    maxLength={40}
    value={form.title}
    onChange={(e) => handleChange("title", e.target.value)}
  />
  {errors.title && <small className="text-danger">{errors.title}</small>}

  {/* Description (scrollable textarea) */}
  <textarea
    className="form-control mb-2"
    placeholder="Description"
    maxLength={200}
    rows={4}
    style={{ maxHeight: "150px", overflowY: "auto", resize: "none" }}
    value={form.description}
    onChange={(e) => handleChange("description", e.target.value)}
  />
  {errors.description && (
            <small className="text-danger">{errors.description}</small>
          )}
          <small className="text-muted d-block text-end">
            {form.description.length}/200
          </small>
  

  {/* Date & Time in one row */}
  <div className="row">
    <div className="col-md-6">
      <input
        className="form-control mb-2"
        type="date"        
        value={form.date}
        min={today}
        onChange={(e) => handleChange("date", e.target.value)}
      />
      {errors.date && <small className="text-danger">{errors.date}</small>}
    </div>

    <div className="col-md-6">
      <input
        className="form-control mb-2"
        type="time"
        value={form.time}
        onChange={(e) => handleChange("time", e.target.value)}
      />
      {errors.time && <small className="text-danger">{errors.time}</small>}
    </div>
  </div>

  {/* Venue & Event Type in one row */}
  <div className="row">
    <div className="col-md-6">
      <input
        className="form-control mb-2"
        placeholder="Venue"
        maxLength={50}
        value={form.venue}
        onChange={(e) => handleChange("venue", e.target.value)}
      />
      {errors.venue && <small className="text-danger">{errors.venue}</small>}
    </div>

    <div className="col-md-6">
      <select
        className="form-select mb-2"
        value={form.event}
        onChange={(e) => handleChange("event", e.target.value)}
      >
        <option value="Tech Talk">Tech Talk</option>
        <option value="Workshop">Workshop</option>
        <option value="Seminar">Seminar</option>
      </select>
    </div>

    {/* Validation Error Message for Event Type (if needed) */}
     

      

  </div>

  {/* Buttons */}
  <div className="d-flex gap-2 mt-3">
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

        <div className="w-100">
          <div className="d-flex gap-2 mb-3">
  <input
    className="form-control"
    placeholder="Search events..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    className="form-select"
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
  >
    <option value="All">All</option>
    <option value="Tech Talk">Tech Talk</option>
    <option value="Workshop">Workshop</option>
    <option value="Seminar">Seminar</option>
  </select>
</div>
          <table className="table table-hover align-middle admin-table">

            <thead className="table-dark">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.length === events.length && events.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>EventID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* {events.length === 0 ? (
                <tr>
                  <td colSpan="" className="text-center text-muted">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr
                  key={ev._id}
                  className={editingId === ev._id ? "table-warning" : ""}
                  > */}
                  
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                  No events found
                  </td>
                </tr>
                ) : (
                  currentEvents.map((ev) => (
                  <tr
                  key={ev._id}
                  className={editingId === ev._id ? "table-warning" : ""}
                  >
    
  

  {/* SELECT */}
  <td>
    <input
      type="checkbox"
      checked={selected.includes(ev._id)}
      onChange={() => toggleSelect(ev._id)}
    />
  </td>
{/* EVENT ID */}
<td>
  {editingId === ev._id ? (
    <input className="form-control" value={editRow.eventId} disabled />
  ) : (
    <Link to={`/admin/events/${ev.eventId}/registrations`}>
      {ev.eventId}
    </Link>
  )}
</td>


  {/* TITLE */}
  <td>
    {editingId === ev._id ? (
      <>
        <input
          className="form-control"
          maxLength={40}
          value={editRow.title}
          onChange={(e) => handleEditChange("title", e.target.value)}
        />
        {editErrors.title && (
          <small className="text-danger">{editErrors.title}</small>
        )}
      </>
    ) : (
      ev.title
    )}
  </td>

  {/* DESCRIPTION */}
  <td>
    {editingId === ev._id ? (
      <>
        <input
          className="form-control"
          maxLength={200}
          value={editRow.description}
          onChange={(e) => handleEditChange("description", e.target.value)}
        />
        {editErrors.description && (
          <small className="text-danger">{editErrors.description}</small>
        )}
      </>
    ) : (
      ev.description
    )}
  </td>

  {/* DATE */}
  <td>
    {editingId === ev._id ? (
      <>
        <input
          type="date"
          className="form-control"
          value={editRow.date?.slice(0, 10)}
          min={today}
          onChange={(e) => handleEditChange("date", e.target.value)}
        />
        {editErrors.date && (
          <small className="text-danger">{editErrors.date}</small>
        )}
      </>
    ) : (
      ev.date
    )}
  </td>

  {/* TIME */}
  <td>
    {editingId === ev._id ? (
      <>
        <input
          type="time"
          className="form-control"
          value={editRow.time}
          onChange={(e) => handleEditChange("time", e.target.value)}
        />
        {editErrors.time && (
          <small className="text-danger">{editErrors.time}</small>
        )}
      </>
    ) : (
      ev.time
    )}
  </td>

  {/* VENUE */}
  <td>
    {editingId === ev._id ? (
      <>
        <input
          className="form-control"
          maxLength={50}
          value={editRow.venue}
          onChange={(e) => handleEditChange("venue", e.target.value)}
        />
        {editErrors.venue && (
          <small className="text-danger">{editErrors.venue}</small>
        )}
      </>
    ) : (
      ev.venue
    )}
  </td>

  {/* TYPE */}
  <td>
    {editingId === ev._id ? (
      <select
        className="form-select"
        value={editRow.event}
        onChange={(e) => handleEditChange("event", e.target.value)}
      >
        <option value="Tech Talk">Tech Talk</option>
        <option value="Workshop">Workshop</option>
        <option value="Seminar">Seminar</option>
      </select>
    ) : (
      ev.event
    )}
  </td>

  {/* ACTIONS (ICONS 🔥) */}
  <td>
    {editingId === ev._id ? (
      <>
        <FaSave
          style={{ cursor: "pointer", marginRight: "10px", color: "green" }}
          onClick={saveEdit}
          title="Save"
        />
        <FaTimes
          style={{ cursor: "pointer", color: "red" }}
          onClick={cancelEdit}
          title="Cancel"
        />
      </>
    ) : (
      <FaEdit
        style={{ cursor: "pointer", color: "#f0ad4e" }}
        onClick={() => handleEdit(ev)}
        title="Edit"
      />
    )}
  </td>
</tr>
                ))
              )}
            </tbody>

          </table>
        </div>

              <div className="d-flex justify-content-center mt-3 gap-2 align-items-center">

  {/* PREV */}
  <button
    className="btn btn-outline-secondary"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Prev
  </button>

  {/* PAGE NUMBERS */}
  {[...Array(totalPages)].map((_, index) => {
    const page = index + 1;
    return (
      <button
        key={page}
        className={`btn ${
          currentPage === page
            ? "btn-primary"
            : "btn-outline-secondary"
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    );
  })}

  {/* NEXT */}
  <button
    className="btn btn-outline-secondary"
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>

</div>

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-end gap-2 mt-3">

          <button
  className="btn btn-outline-secondary"
  disabled={selected.length === 0}
  onClick={() => {selected.status = "cancelled"; deleteSelected("cancelled")}}
>
  Cancel Selected
</button>

{/* <button
  className="btn btn-outline-secondary"
  disabled={selected.length === 0}
  onClick={() => updateStatusForSelected("updated")}
>
  Update Selected
</button> */}

<button
  className="btn btn-danger"
  disabled={selected.length === 0}
  onClick={() => {selected.status = "deleted"; deleteSelected()}}
>
  Delete Selected ({selected.length})
</button>

        </div>

      </div>
    </div>
  );
}