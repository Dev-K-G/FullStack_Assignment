import { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event: "Tech Talk",
    notify: false
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.phone) {
      if (!/^\d+$/.test(form.phone)) {
        newErrors.phone = "Phone must contain only numbers";
      } else if (form.phone.length !== 10) {
        newErrors.phone = "Phone must be exactly 10 digits";
      }
    }

    return newErrors;
  };

  const submit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      console.log("Submitting form:", form);
      await axios.post("http://localhost:5001/api/register", form);
      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      event: "Tech Talk",
      notify: false
    });
    setErrors({});
    setSuccess(false);
  };

  // ✅ FIX: clearer + reactive validity check
  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    (!form.phone || /^\d{10}$/.test(form.phone)) &&
    Object.values(errors).every((e) => !e);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">

      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>

        {!success ? (
          <>
            <h3 className="text-center mb-4">
              Event Registration Form
            </h3>

            <h5 className="border-bottom pb-2 mb-3">
              Personal Details
            </h5>

            <div className="row g-3">

              {/* Name */}
              <div className="col-md-6">
                <label className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });

                    if (errors.name) {
                      setErrors({ ...errors, name: "" });
                    }
                  }}
                />
                {errors.name && (
                  <div className="text-danger small">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });

                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                />
                {errors.email && (
                  <div className="text-danger small">{errors.email}</div>
                )}
              </div>

              {/* Phone */}
              <div className="col-12">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, phone: value });

                    if (errors.phone) {
                      setErrors({ ...errors, phone: "" });
                    }
                  }}
                />
                {errors.phone && (
                  <div className="text-danger small">{errors.phone}</div>
                )}
              </div>

            </div>

            <h5 className="border-bottom pb-2 mt-4 mb-3">
              Event Details
            </h5>

            <div className="row g-3 align-items-center">

              <div className="col-md-6">
                <label className="form-label">Select Event</label>
                <select
                  className="form-select"
                  value={form.event}
                  onChange={(e) =>
                    setForm({ ...form, event: e.target.value })
                  }
                >
                  <option value="Tech Talk">Tech Talk</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div className="col-md-6 mt-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.notify}
                    onChange={(e) =>
                      setForm({ ...form, notify: e.target.checked })
                    }
                  />
                  <label className="form-check-label">
                    Notify me about future events
                  </label>
                </div>
              </div>

            </div>

            <div className="d-flex gap-2 mt-4">

              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline-secondary w-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submit}
                disabled={!isValid}
                className="btn btn-primary w-50"
              >
                Register
              </button>

            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <h4 className="text-success mb-3">
               Registration Successful!
            </h4>
            <p className="text-muted">
              Thank you for registering. We’ll contact you soon.
            </p>

            <button
              onClick={handleCancel}
              className="btn btn-primary mt-3"
            >
              Register Another
            </button>
          </div>
        )}

      </div>
    </div>
  );
}