//import bgImage from "./assets/event-bg-2.jpg";

import "../styles/home.css"; 

export default function Home() {
  return (
    <div className="home-container">

      {/* BACKGROUND */}
      <div
        className="home-bg"
        style={{
          backgroundImage: "url('../assets/event-bg-2.jpg')",
        }}
      />

      {/* OVERLAY */}
      <div className="home-overlay" />

      {/* CONTENT */}
      <div className="home-content">
        <div className="glass-layer">
          <div className="glass-inner">
            <div className="dark-wrapper">
              <div className="white-box">
                <div className="black-core">

                  <h1 className="home-title">
                    Event Registration And Management System
                  </h1>

                  <p className="home-text">
                    Join workshops, seminars and professional events.
                  </p>

                  <a
                    href="/events"
                    className="btn btn-primary px-4 py-2"
                  >
                    View Events
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}