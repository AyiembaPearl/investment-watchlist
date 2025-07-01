import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_KEY = "jM7phybBv8vXqlP5eGlxSnS4Y11LMltf";

const defaultNSEStocks = [
  { name: "Safaricom", price: "", pe: "", yield: "", notes: "", lastUpdated: "" },
  { name: "Equity Bank", price: "", pe: "", yield: "", notes: "", lastUpdated: "" },
  { name: "KCB Group", price: "", pe: "", yield: "", notes: "", lastUpdated: "" },
  { name: "EABL", price: "", pe: "", yield: "", notes: "", lastUpdated: "" },
  { name: "NSE ETF", price: "", pe: "", yield: "", notes: "", lastUpdated: "" }
];

const globalStocks = ["AAPL", "VOO"];

function App() {
  const [nseStocks, setNseStocks] = useState(() => {
    const saved = localStorage.getItem("nseStocks");
    return saved ? JSON.parse(saved) : defaultNSEStocks;
  });

  const [globalData, setGlobalData] = useState([]);
  const [globalLastFetched, setGlobalLastFetched] = useState("");

  const [amount, setAmount] = useState(39000);
  const [mmfRate, setMmfRate] = useState(13.45);
  const [tBillRate, setTBillRate] = useState(16.3);
  const [duration, setDuration] = useState(182);

  useEffect(() => {
    localStorage.setItem("nseStocks", JSON.stringify(nseStocks));
  }, [nseStocks]);

  useEffect(() => {
    async function fetchGlobalData() {
      try {
        const res = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${globalStocks.join(",")}?apikey=${API_KEY}`
        );
        const data = await res.json();
        setGlobalData(data);
        setGlobalLastFetched(new Date().toLocaleString());
      } catch (err) {
        console.error("API fetch error:", err);
      }
    }
    fetchGlobalData();
  }, []);

  const updateNseStock = (index, field, value) => {
    const updated = [...nseStocks];
    updated[index][field] = value;
    updated[index].lastUpdated = new Date().toLocaleString();
    setNseStocks(updated);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(nseStocks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NSE Stocks");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "NSE_Stocks.xlsx");
  };

  const mmfReturn = (amount * mmfRate * 365) / (100 * 365);
  const tBillReturn = (amount * tBillRate * duration) / (100 * 365);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 NSE Stock Watchlist (Manual)</h1>
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "10px" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Stock</th>
            <th>Price (KES)</th>
            <th>P/E</th>
            <th>Yield (%)</th>
            <th>Notes</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {nseStocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.name}</td>
              <td><input value={stock.price} onChange={(e) => updateNseStock(index, "price", e.target.value)} /></td>
              <td><input value={stock.pe} onChange={(e) => updateNseStock(index, "pe", e.target.value)} /></td>
              <td><input value={stock.yield} onChange={(e) => updateNseStock(index, "yield", e.target.value)} /></td>
              <td><input value={stock.notes} onChange={(e) => updateNseStock(index, "notes", e.target.value)} /></td>
              <td>{stock.lastUpdated || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={exportToExcel} style={{ marginBottom: "40px", padding: "8px 16px" }}>📤 Export to Excel</button>

      <h2>🌍 Global Stocks (Live Data via API)</h2>
      <p><strong>Last Fetched:</strong> {globalLastFetched || "-"}</p>
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "40px" }}>
        <thead style={{ backgroundColor: "#e0f7fa" }}>
          <tr>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>P/E</th>
            <th>Dividend Yield (%)</th>
          </tr>
        </thead>
        <tbody>
          {globalData.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.price?.toFixed(2)}</td>
              <td>{stock.pe?.toFixed(2) || "-"}</td>
              <td>{stock.lastDiv ? (stock.lastDiv * 100 / stock.price).toFixed(2) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>💰 MMF vs Treasury Bill Return Calculator</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "600px" }}>
        <label>
          Investment Amount (KES):
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </label>
        <label>
          MMF Rate (% p.a.):
          <input type="number" step="0.01" value={mmfRate} onChange={(e) => setMmfRate(parseFloat(e.target.value))} />
        </label>
        <label>
          T-Bill Rate (%):
          <input type="number" step="0.01" value={tBillRate} onChange={(e) => setTBillRate(parseFloat(e.target.value))} />
        </label>
        <label>
          T-Bill Duration (days):
          <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
        </label>
      </div>

      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        <p>📈 <strong>Projected MMF Return (1 year):</strong> KES {mmfReturn.toFixed(2)}</p>
        <p>📈 <strong>Projected T-Bill Return ({duration} days):</strong> KES {tBillReturn.toFixed(2)}</p>
        <p>
          ✅ <strong>Better Option:</strong>{" "}
          {tBillReturn > mmfReturn * (duration / 365) ? "Treasury Bill" : "MMF"}
        </p>
      </div>
    </div>
  );
}

export default App;
