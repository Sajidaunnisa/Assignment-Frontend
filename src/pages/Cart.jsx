import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await api.get("/api/cart");
      setCart(res.data.cart || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId) => {
    try {
      await api.post("/api/cart/remove", { itemId }); // remove entirely
      await fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const changeQty = async (itemId, delta) => {
    try {
      if (delta > 0) {
        await api.post("/api/cart/add", { itemId, qty: delta });
      } else {
        await api.post("/api/cart/remove", { itemId, qty: Math.abs(delta) });
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const total = cart.reduce((s, ci) => s + (ci.item?.price || 0) * ci.qty, 0);

  if (loading) return <div className="container py-4">Loading cart...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Cart</h3>
        <div>
          <Link to="/dashboard" className="btn btn-outline-secondary me-2">
            Continue shopping
          </Link>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty</div>
      ) : (
        <>
          <div className="list-group mb-3">
            {cart.map((ci, idx) => (
              <div key={idx} className="list-group-item">
                <div className="d-flex align-items-center">
                  <img
                    src={ci.item?.image || "https://via.placeholder.com/70"}
                    alt={ci.item?.name || "No image"}
                    style={{ width: 70, height: 70, objectFit: "cover" }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{ci.item?.name || "Unknown Item"}</h6>
                    <small className="text-muted">
                      {ci.item?.category || "Uncategorized"}
                    </small>
                  </div>
                  <div className="text-end me-3">
                    <div>₹{ci.item?.price || 0}</div>
                    <div>Qty: {ci.qty}</div>
                  </div>
                  <div>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => changeQty(ci.item?._id, -1)}
                        disabled={!ci.item}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => changeQty(ci.item?._id, 1)}
                        disabled={!ci.item}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeItem(ci.item?._id)}
                        disabled={!ci.item}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <strong>Total:</strong>
              <h5>₹{total}</h5>
            </div>
            <div className="mt-3 text-end">
              <button className="btn btn-success">Buy Now</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
