import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function UnsubscribeForm() {
  const [success, setSuccess] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleUnsubscribe = async () => {
   const confirmAction = window.confirm(
    "Are you sure you want to unsubscribe?"
  );

  if (!confirmAction) return;


    try {      
        axios.delete(`http://localhost:5001/api/subscribers/unsubscribe/${token}`);        
        setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Invalid or expired link");
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>

        {!success ? (
          <>
            <h4 className="mb-3">Unsubscribe</h4>

            <div className="form-check d-flex justify-content-center mb-3">
              <input type="checkbox" className="form-check-input" checked disabled />
              <label className="form-check-label ms-2">
                Receive event notifications
              </label>
            </div>

            <button
              className="btn btn-danger w-100"
              onClick={handleUnsubscribe}
            >
              Unsubscribe
            </button>
          </>
        ) : (
          <h5 className="text-success">You have been unsubscribed</h5>
        )}

      </div>
    </div>
  );
}