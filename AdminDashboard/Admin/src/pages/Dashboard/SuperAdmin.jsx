import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuperAdmin.css";
import profile from "../../assets/images/super_admin_profile.jpg";

const SuperAdmin = () => {
  const [users, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const CLOUD_NAME = "dxxdvybeg";
  const UPLOAD_PRESET = "auth-preset";

  useEffect(() => {
    axios
      .get("http://localhost:5000/spdash")
      .then((res) => {
        setAllUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
        setAllUsers([]);
      });
  }, []);

  const handleRoles = (r, id) => {
    const role = r.target.value;
    axios
      .post("http://localhost:5000/sprole", { role, id })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/delete/${id}`)
      .then((res) => {
        alert(res.data.message);
        setAllUsers(users.filter((data) => data._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;

      const productRes = await axios.post("http://localhost:5000/productsAdd", {
        name,
        price,
        quantity,
        color,
        image: imageUrl,
      });

      alert(productRes.data.message);

      navigate("/admin");

      setName("");
      setPrice("");
      setQuantity("");
      setColor("");
      setImage(null)

      setShowForm(true)

    } 
    catch (err) {
      console.log(err);
      alert("Error while adding product");
    }
  };

  return (
    <div className="superadmin-dashboard">
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
              { icon: "📊", label: "Dashboard" },
              { icon: "🍽️", label: "Orders" },
              { icon: "👥", label: "Guest traffic", active: true },
              { icon: "🎁", label: "Gifts", badge: "2+" },
              { icon: "👨‍💼", label: "Admin Dashboard", route: "/admin" },
            ].map((item, i) => (
              <li
                key={i}
                className={item.active ? "active" : ""}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </li>
            ))}
          </ul>
          <h3 className="menu-title">SETTINGS</h3>
          <ul>
            {[
              { icon: "👤", label: "Account" },
              { icon: "💳", label: "Wallet" },
              { icon: "❓", label: "Help & support" },
              { icon: "🔐", label: "Login", route: "/" },
            ].map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  }
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
            <a href="#" className="active">
              Guest list
            </a>
            <a href="#">Overview</a>
            <a href="#">Temporary traffic</a>
          </div>
          <div className="nav-right">
            <button className="icon-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <button
              className="add-product-btn"
              onClick={() => setShowForm(true)}
            >
              + Add Product
            </button>
            <div className="profile-pic">
              <img src={profile} alt="Profile" />
            </div>
          </div>
        </nav>

        {/* User Table */}
        <main className="content-area">
          <h1>Superadmin Page</h1>
          <div className="user-table">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        defaultValue={user.role}
                        onChange={(r) => handleRoles(r, user._id)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </td>
                    <td>
                      <button className="action-btn edit">
                        <i className="fas fa-pen-to-square"></i>
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Enter color"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
