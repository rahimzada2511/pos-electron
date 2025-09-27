import React, { useState, useEffect } from "react";

function PosInventoryApp() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.dbQuerySample().then((res) => {
        if (res.ok) setProducts(res.products);
        else setMessage("Error loading products: " + res.error);
      });
    }
  }, []);

  const handleBackup = async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const folder = result.filePaths[0];
      const res = await window.electronAPI.dbBackup(folder);
      if (res.ok) setMessage("Backup created at " + res.path);
      else setMessage("Backup failed: " + res.error);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>POS Inventory</h1>
      <button onClick={handleBackup}>Create Backup</button>
      {message && <p>{message}</p>}
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price} ({p.stock} in stock)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PosInventoryApp;
