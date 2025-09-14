import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [msg, setMsg] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/home", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setMsg(res.data.username);
        getAllProducts();
      })
      .catch(() => {
        setMsg("User not verified!");
      });
  }, []);

  const getAllProducts = () => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home-container">
      <h1 className="welcome">Welcome - {msg}</h1>
      <h2 className="title">Our Products</h2>

      <div className="product-grid">
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <div className="img-container">
              <img src={p.image} alt={p.name} />
              <div className="overlay">
                <i className="fas fa-shopping-cart icon"></i>
                <i className="fas fa-heart icon"></i>
              </div>
            </div>
            <div className="card-details">
              <h3 className="product-name">{p.name}</h3>
              <div className="product-info">
                <span>₹{p.price}</span>
                <span>Qty: {p.quantity}</span>
                <span>Color: {p.color}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
