import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Products from "./Products";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, {user?.name}</h3>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
      <Products />
    </div>
  );
}
