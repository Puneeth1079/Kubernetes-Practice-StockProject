import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "./config.js";
import "./stock.css";

const EMPTY_STOCK = {
  id: "",
  name: "",
  price: "",
  state: "INC",
  investment: "",
};

export default function StockTracker() {
  const baseUrl = `${config.url}/stockapi`;

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_STOCK });
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [loading, setLoading] = useState(false);

  // Find by ID state
  const [lookupId, setLookupId] = useState("");
  const [found, setFound] = useState(null);

  const toast = (text, type = "info", ms = 2000) => {
    setMsg(text);
    setMsgType(type);
    if (ms) setTimeout(() => setMsg(""), ms);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast("Failed to fetch stocks.", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const req = ["name", "price", "state", "investment"];
    for (const k of req) {
      const v = form[k];
      if (v === undefined || v === null || String(v).trim() === "") {
        toast(`Please fill out the ${k} field.`, "error", 3000);
        return false;
      }
    }
    for (const k of ["price", "investment"]) {
      if (isNaN(Number(form[k]))) {
        toast(`${k} must be numeric.`, "error", 3000);
        return false;
      }
    }
    if (!(form.state === "INC" || form.state === "DEC")) {
      toast("state must be INC or DEC.", "error", 3000);
      return false;
    }
    return true;
  };

  const toPayload = (f) => ({
    ...f,
    id: f.id === "" ? null : Number(f.id),
    price: Number(f.price),
    investment: Number(f.investment),
  });

  const fromApi = (s) => ({
    id: s.id == null ? "" : String(s.id),
    name: s.name ?? "",
    price: s.price == null ? "" : String(s.price),
    state: s.state === "DEC" ? "DEC" : "INC",
    investment: s.investment == null ? "" : String(s.investment),
  });

  const addStock = async () => {
    if (!validate()) return;
    try {
      await axios.post(`${baseUrl}/add`, toPayload(form));
      toast("Stock added.", "success");
      setForm({ ...EMPTY_STOCK });
      setEditMode(false);
      refresh();
    } catch {
      toast("Error adding stock.", "error", 3000);
    }
  };

  const updateStock = async () => {
    if (!validate()) return;
    try {
      await axios.put(`${baseUrl}/update`, toPayload(form));
      toast("Stock updated.", "success");
      setForm({ ...EMPTY_STOCK });
      setEditMode(false);
      refresh();
    } catch {
      toast("Error updating stock.", "error", 3000);
    }
  };

  const deleteStock = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      toast("Stock deleted.", "success");
      refresh();
      if (found && String(found.id) === String(id)) {
        setFound(null);
        setLookupId("");
      }
    } catch {
      toast("Error deleting stock.", "error", 3000);
    }
  };

  // ---- Find by ID (kept) ----
  const loadById = async (id) => {
    const str = String(id || lookupId).trim();
    if (!str) return;
    const asNum = Number(str);
    if (isNaN(asNum)) {
      toast("ID must be numeric.", "error", 3000);
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/get/${asNum}`);
      if (res.data && res.data.id !== undefined) {
        setFound(res.data);
        setLookupId(String(asNum));
        toast(`Loaded ID: ${asNum}`, "success");
      } else {
        setFound(null);
        toast(`ID ${asNum} not found.`, "error", 3000);
      }
    } catch {
      setFound(null);
      toast(`ID ${asNum} not found.`, "error", 3000);
    }
  };

  return (
    <div className="stk-container">
      {msg && <div className={`stk-banner ${msgType}`}>{msg}</div>}

      <header className="stk-header">
        <div>
          <h2>Stock Management System</h2>
          <p className="stk-sub">Track price, direction, and investment</p>
        </div>
        <div className="stk-actions">
          <button className="btn" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Find by ID (kept) */}
      <section className="stk-card">
        <div className="stk-card-header">
          <h3>Find Stock by ID</h3>
        </div>
        <div className="stk-row gap">
          <input
            className="inp narrow"
            placeholder="Enter ID and press Enter"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadById(e.currentTarget.value);
            }}
          />
          <button className="btn ghost" onClick={() => loadById()}>
            Fetch
          </button>
          {found && (
            <button
              className="btn"
              onClick={() => {
                setFound(null);
                setLookupId("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        {found && (
          <div className="stk-details" style={{ marginTop: 12 }}>
            <div className="stk-row gap" style={{ flexWrap: "wrap" }}>
              <div><strong>ID:</strong> {found.id}</div>
              <div><strong>Name:</strong> {found.name}</div>
              <div><strong>Price:</strong> {found.price}</div>
              <div><strong>State:</strong> {found.state}</div>
              <div><strong>Investment:</strong> {found.investment}</div>
            </div>
            <div className="stk-row gap right" style={{ marginTop: 10 }}>
              <button
                className="btn primary"
                onClick={() => {
                  setForm(fromApi(found));
                  setEditMode(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit This Stock
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Form */}
      <section className="stk-card">
        <div className="stk-card-header">
          <h3>{editMode ? "Edit Stock" : "Add Stock"}</h3>
          {editMode && (
            <button
              className="btn ghost"
              onClick={() => {
                setForm({ ...EMPTY_STOCK });
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="stk-grid">
          <input
            className="inp"
            type="number"
            name="id"
            placeholder="ID (optional)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          <input
            className="inp"
            name="name"
            placeholder="Stock Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="inp"
            type="number"
            step="0.01"
            name="price"
            placeholder="Current Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <select
            className="inp"
            name="state"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          >
            <option value="INC">INC (Up)</option>
            <option value="DEC">DEC (Down)</option>
          </select>
          <input
            className="inp"
            type="number"
            step="0.01"
            name="investment"
            placeholder="Your Investment"
            value={form.investment}
            onChange={(e) => setForm({ ...form, investment: e.target.value })}
          />
        </div>

        <div className="stk-row gap right">
          {!editMode ? (
            <button className="btn primary" onClick={addStock}>Add Stock</button>
          ) : (
            <button className="btn success" onClick={updateStock}>Update Stock</button>
          )}
        </div>
      </section>

      {/* Table (no ROI) */}
      <section className="stk-card">
        <div className="stk-card-header">
          <h3>All Stocks ({items.length})</h3>
        </div>
        {items.length === 0 ? (
          <p className="muted">No stocks found.</p>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>State</th>
                  <th>Investment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.price}</td>
                    <td>{s.state}</td>
                    <td>{s.investment}</td>
                    <td>
                      <div className="btn-row">
                        <button
                          className="btn ghost"
                          onClick={() => {
                            setForm(fromApi(s));
                            setEditMode(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn danger"
                          onClick={() => deleteStock(s.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="stk-footer">
        <small>by puneeth</small>
      </footer>
    </div>
  );
}
