import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function Products() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "",
    "Shoes",
    "Clothing",
    "Electronics",
    "Furniture",
    "Accessories",
  ];
  //for now I have hardcoded categories, ideally fetch from backend

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await api.get("/api/items", { params });
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addToCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await api.post("/api/cart/add", { itemId, qty: 1 });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to add to cart");
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products</h3>
        <div>
          <Link to="/cart" className="btn btn-outline-primary">
            View Cart
          </Link>
        </div>
      </div>

      <form className="row g-2 mb-3" onSubmit={handleFilter}>
        <div className="col-md-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            placeholder="Min price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <input
            placeholder="Max price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            Filter
          </button>
        </div>
        <div className="col-md-3 text-end">
          <button
            type="button"
            className="btn btn-dark me-2"
            onClick={() => {
              setCategory("");
              setMinPrice("");
              setMaxPrice("");
              fetchItems();
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {items.length === 0 && <div className="col-12">No items found</div>}
          {items.map((item) => (
            <div className="col-md-4 mb-3" key={item._id}>
              <div className="card h-100">
                {item.image && (
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: 230, objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted mb-1">{item.category}</p>
                  <p className="card-text flex-grow-1">
                    {item.description?.slice(0, 100)}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>₹{item.price}</strong>
                    <div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => addToCart(item._id)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
