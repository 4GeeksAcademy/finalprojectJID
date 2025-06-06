import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoNavbar from "../assets/img/icono.png";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { store, dispatch } = useGlobalReducer();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");
    dispatch({ type: "SET_TOKEN", payload: null });
    dispatch({ type: "SET_USER",  payload: null });
    navigate("/signin");
  };
  // ① Whenever we have a token but no user, call GET /api/user to fetch the user data
  // The token is stored in localStorage and is used to authenticate the request
  useEffect(() => {
    if (store.token && !store.user) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${store.token}`  // Include the token in the Authorization header
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        })
        .then(userObj => {
          dispatch({ type: "SET_USER", payload: userObj });
        })
        .catch(() => {
          // if the token is bad/expired, clear it
          localStorage.removeItem("token");
          dispatch({ type: "SET_TOKEN", payload: null });
          dispatch({ type: "SET_USER", payload: null });
          localStorage.setItem("session_expired", "1");
          navigate("/signin");
        });
    }
  }, [store.token, store.user, dispatch, navigate]);


  return (
    <nav
      className="py-4"
      style={{
        background: "linear-gradient(to right, #1a0033, #330033)",
        color: "#ccc",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        fontFamily: "'Orbitron', sans-serif",
        boxShadow: "0 -2px 10px rgba(255, 0, 204, 0.3)",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Marquee */}
        {location.pathname === "/" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "250px",
                marginTop: "3px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  paddingLeft: "100%",
                  animation: "marquee 12s linear infinite",
                  color: "#FF00FF",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  letterSpacing: "1px",
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: `
                    0 0 2px #FF00FF,
                    0 0 6px #FF00FF,
                    0 0 12px #FF00FF
                  `,
                }}
              >
                Find your perfect cocktail ... or the best place to enjoy it!
              </div>
            </div>
          </div>
        ) : (
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img
              src={logoNavbar}
              alt="Logo"
              width="70"
              height="70"
              className="rounded-circle shadow-sm"
              style={{
                border: "2px solid #FF00FF",
                boxShadow: "0 0 10px #FF00FF",
                transition: "box-shadow 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 20px #FF00FF, 0 0 30px #FF00FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 10px #FF00FF";
              }}
            />
          </Link>
        )}

        {/* Buttons */}
        <div className="d-flex align-items-center">
          {location.pathname !== "/" && (
            <button
              onClick={() => navigate(-1)}
              className="bg-transparent border-0 me-3"
              style={{
                fontSize: "1.8rem",
                color: "#FF00FF",
                textShadow: "0 0 10px #FF00FF",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textShadow = "0 0 20px #FF00FF, 0 0 30px #FF00FF")
              }
              onMouseLeave={(e) =>
                (e.target.style.textShadow = "0 0 10px #FF00FF")
              }
            >
              <i className="bi bi-arrow-left-circle-fill"></i>
            </button>
          )}
          {store.user && location.pathname !== "/profile" && (
            <span
              style={{
                marginRight: "1rem",
                color: "#fff",
                textShadow: "0 0 6px #FF00FF"
              }}
            >
              Welcome, {store.user.name}
            </span>
          )}

          {!store.token && location.pathname !== "/signin" && (
            <Link
              to="/signin"
              className="btn me-2"
              style={{
                background: "#FF00FF",
                borderColor: "#FF00FF",
                color: "#fff",
                boxShadow: "0 0 8px #FF00FF",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) =>
              (e.target.style.boxShadow =
                "0 0 12px #FF00FF, 0 0 24px #FF00FF, 0 0 36px #FF00FF")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 8px #FF00FF")
              }
            >
              Sign In
            </Link>
          )}

          {!store.token && location.pathname !== "/signup" && (
            <Link
              to="/signup"
              className="btn"
              style={{
                background: "#00AFFF",
                borderColor: "#00AFFF",
                color: "#fff",
                boxShadow: "0 0 8px #00AFFF",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) =>
              (e.target.style.boxShadow =
                "0 0 12px #00AFFF, 0 0 24px #00AFFF, 0 0 36px #00AFFF")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 8px #00AFFF")
              }
            >
              Sign Up
            </Link>
          )}

          {/* My MainPage */}
          {store.token && location.pathname !== "/MainPage" && location.pathname !== "/profile" &&(
            <Link
              to="/MainPage"
              className="btn me-2"
              style={{
                background: "#00AFFF",
                borderColor: "#00AFFF",
                color: "#fff",
                boxShadow: "0 0 8px #00AFFF",
                fontWeight: "bold",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = "0 0 12px #00AFFF, 0 0 24px #00AFFF")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 8px #00AFFF")
              }
            >
              <i className="bi bi-person-circle me-2"></i> Profile
            </Link>
          )}


          {store.token && (
            <button
              onClick={handleLogout}
              className="btn ms-2"
              style={{
                background: "#8800FF",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                boxShadow: "0 0 8px #8800FF",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = "0 0 16px #8800FF, 0 0 24px #8800FF")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 8px #8800FF")
              }
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
