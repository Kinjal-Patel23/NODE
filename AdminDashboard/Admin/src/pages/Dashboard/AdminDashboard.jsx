import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import adminprofile from "../../assets/images/admin_profile.jpg";

const Admin = () => {
  const [users, setAllUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    quantity: "",
    color: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/admindash")
      .then((res) => {
        setAllUsers(res.data.users.filter((u) => u.role === "user"));
      })
      .catch((err) => {
        console.log(err);
        setAllUsers([]);
      });
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setProducts(res.data.products || res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEditProduct = (p) => {
    setEditId(p._id);
    setEditData({ ...p });
  };

  const handleSave = (id) => {
    axios
      .put(`http://localhost:5000/productsdata/${id}`, editData)
      .then((res) => {
        alert(res.data.message);
        setEditId(null);
        setProducts(
          products.map((p) => (p._id === id ? res.data.updatedProduct : p))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:5000/products/${id}`)
      .then((res) => {
        setProducts(products.filter((p) => p._id !== id));
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userRoleData = [
    { label: "Users", value: 50, color: "#4f46e5" },
    { label: "Admins", value: 30, color: "#10b981" },
    { label: "SuperAdmins", value: 20, color: "#f59e0b" },
  ];

  const total = userRoleData.reduce((sum, d) => sum + d.value, 0);

  let start = 0;
  const gradient = userRoleData
    .map((item) => {
      const percent = (item.value / total) * 100;
      const segment = `${item.color} ${start}% ${start + percent}%`;
      start += percent;
      return segment;
    })
    .join(", ");

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">
            <span className="logo-text">A</span>
          </div>
          <span className="logo-name">Admix</span>
        </div>
        <nav className="sidebar-menu">
          <h3 className="menu-title">MAIN MENU</h3>
          <ul>
            {[
              {
                icon: "📊",
                label: "Dashboard",
                active: activePage === "dashboard",
              },
              { icon: "👥", label: "Users", active: activePage === "users" },
              {
                icon: "📦",
                label: "Products",
                active: activePage === "products",
              },
              {
                icon: "📈",
                label: "Analytics",
                active: activePage === "analytics",
              },
            ].map((item, i) => (
              <li
                key={i}
                className={item.active ? "active" : ""}
                onClick={() => setActivePage(item.label.toLowerCase())}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <h3 className="menu-title">SETTINGS</h3>
          <ul>
            {[
              { icon: "👤", label: "Account" },
              { icon: "💳", label: "Wallet" },
              { icon: "❓", label: "Help & support" },
              { icon: "🔐", label: "Login" },
            ].map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  if (item.label === "Login") navigate("/");
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-links">
            <a
              href="#"
              className={activePage === "dashboard" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActivePage("dashboard");
              }}
            >
              Dashboard
            </a>
            <a
              href="#"
              className={activePage === "users" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActivePage("users");
              }}
            >
              Users
            </a>
            <a
              href="#"
              className={activePage === "products" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActivePage("products");
              }}
            >
              Products
            </a>
          </div>
          <div className="nav-right">
            <button className="icon-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <div className="profile-pic">
              <img src={adminprofile} alt="Profile" />
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <main className="content-area">
          {activePage === "dashboard" && (
            <>
              <h1>Admin Dashboard</h1>
              {/* Stats */}
              <div className="stats-cards">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p>{users.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Products</h3>
                  <p>{products.length}</p>
                </div>
                <div className="stat-card">
                  <h3>New Signups</h3>
                  <p>
                    {
                      users.filter(
                        (u) =>
                          new Date(u.createdAt) >=
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </p>
                </div>
              </div>

              {/* Users List & Pie Chart */}
              <div className="dashboard-grid">
                {/* Users List */}
                <div className="users-section">
                  <h2>Users</h2>
                  <div className="user-list">
                    {users.map((user, i) => (
                      <div key={i} className="user-card">
                        <div className="user-info">
                          <h4>{user.username}</h4>
                          <p>{user.email}</p>
                        </div>
                        <span className="role-badge">{user.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="chart-section">
                  <h2>User Distribution</h2>
                  <div className="pie-chart-wrapper">
                    <div
                      className="pie-chart-container"
                      style={{ background: `conic-gradient(${gradient})` }}
                    ></div>
                    <div className="pie-legend">
                      {userRoleData.map((item, index) => (
                        <div key={index} className="legend-item">
                          <span
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="legend-label">{item.label}</span>
                          <span className="legend-value">
                            {((item.value / total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "users" && (
            <>
              <h2>Users</h2>
              <div className="users-page-list">
                {users.map((user, i) => (
                  <div key={i} className="user-card">
                    <div className="user-info">
                      <h4>{user.username}</h4>
                      <p>{user.email}</p>
                    </div>
                    <span className="role-badge">{user.role}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activePage === "products" && (
            <>
              <div className="products-header">
                <h2>Products</h2>
              </div>
              <div className="product-list">
                {products.map((product, i) => (
                  <div key={i} className="product-card">
                    {editId === product._id ? (
                      <div className="edit-form">
                        <div className="edit-form-group">
                          <label>Product Name</label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="edit-form-group">
                          <label>Price</label>
                          <input
                            type="number"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="edit-form-group">
                          <label>Quantity</label>
                          <input
                            type="number"
                            value={editData.quantity}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                quantity: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="edit-form-group">
                          <label>Color</label>
                          <input
                            type="text"
                            value={editData.color}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                color: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="edit-form-actions">
                          <button
                            className="save-btn"
                            onClick={() => handleSave(product._id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="product-display">
                          <div className="product-image-container">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-thumbnail"
                            />
                          </div>
                          <div className="product-info">
                            <h4>{product.name}</h4>
                            <p>
                              ₹{product.price} | Qty: {product.quantity} |
                              Color: {product.color}
                            </p>
                          </div>
                        </div>
                        <div className="product-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activePage === "analytics" && (
            <>
              <h2>Analytics</h2>
              <div className="big-chart">
                <div className="pie-chart-wrapper">
                  <div
                    className="pie-chart-container"
                    style={{ background: `conic-gradient(${gradient})` }}
                  ></div>
                  <div className="pie-legend">
                    {userRoleData.map((item, index) => (
                      <div key={index} className="legend-item">
                        <span
                          className="legend-color"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="legend-label">{item.label}</span>
                        <span className="legend-value">
                          {((item.value / total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
