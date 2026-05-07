export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden"
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('../assets/event-bg-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3px) brightness(0.7)",
          transform: "scale(1.1)"
        }}
      />

      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)"
        }}
      />

      {/* RIGHT EDGE PANEL (UPDATED) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100vh",
          width: "55%",                 // flows into center
          display: "flex",
          alignItems: "center",        // vertical center only
          justifyContent: "flex-end",  // sticks to right edge
          padding: "0px"
        }}
      >
        {/* LAYER 1 */}
        <div
          style={{
            width: "100%",
            padding: "22px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "20px",
            boxShadow: "0 0 40px rgba(0,0,0,0.4)"
          }}
        >
          {/* LAYER 2 */}
          <div
            style={{
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.35)",
              borderRadius: "18px"
            }}
          >
            {/* OUTER BLACK LAYER */}
            <div
              style={{
                padding: "18px",
                borderRadius: "16px",
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.12)",
                marginBottom: "12px"
              }}
            >
              {/* WHITE BOX */}
              <div
                style={{
                  padding: "10px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  border: "1px solid #e6e6e6"
                }}
              >
                {/* BLACK CORE */}
                <div
                  style={{
                    padding: "40px",
                    borderRadius: "12px",
                    background: "#0f0f0f",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.12)"
                  }}
                >
                  <h1 className="mb-3 fw-bold text-white">
                    Event Registration System
                  </h1>

                  <p className="text-light mb-4">
                    Join workshops, seminars and professional events.
                  </p>

                  <a href="/events" className="btn btn-primary px-4 py-2">
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