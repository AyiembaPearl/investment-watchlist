import React, { useEffect, useState } from "react";

// Your API key
const API_KEY = "jM7phybBv8vXqlP5eGlxSnS4Y11LMltf";

const initialStocks = [
  { symbol: "SCOM.L", name: "Safaricom (SCOM)", sector: "Telco", price: "", range: "", yield: "", pe: "", notes: "" },
  { symbol: "", name: "Equity Bank (EQTY)", sector: "Banking", price: "", range: "", yield: "", pe: "", notes: "" },
  { symbol: "", name: "KCB Group", sector: "Banking", price: "", range: "", yield: "", pe: "", notes: "" },
  { symbol: "", name: "EABL", sector: "Consumer Goods", price: "", range: "", yield: "", pe: "", notes: "" },
  { symbol: "", name: "NSE ETF", sector: "Index Fund", price: "", range: "", yield: "", pe: "", notes: "" }
];

function App() {
  const [stocks, setStocks] = useState(initialStocks);
  const [amount, setAmount] = useState(39000);
  const [mmfRate, setMmfRate] = useState(13.45);
  const [tBillRate, setTBillRate] = useState(16.3);
  const [duration, setDuration] = useState(182);

  useEffect(() => {
    async function fetchStockData() {
      try {
        const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/SCOM.L?apikey=${API_KEY}`);
        const data = await res.json();
        if (data && data[0]) {
          const updatedStocks = [...stocks];
          updatedStocks[0].price = data[0].price.toFixed(2);
          updatedStocks[0].pe = data[0].pe ? data[0].pe.toFixed(2) : "-";
          updatedStocks[0].yield = data[0].lastDiv ? `${data[0].lastDiv.toFixed(2)}%` : "-";
          setStocks(updatedStocks);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }

    fetchStockData();
  }, []);

  const handleChange = (index, field, value) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  const calcReturns = (principal, rate, days) => {
    return (principal * rate * days) / (100 * 365);
  };

  const mmfReturn = calcReturns(amount, mmfRate, 365);
  const tBillReturn = calcReturns(amount, tBillRate, duration);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>📈 Investment Watchlist</h1>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Stock</th>
            <th>Sector</th>
            <th>Price (KES)</th>
            <th>52-Week Range</th>
            <th>Dividend Yield</th>
            <th>P/E Ratio</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.name}</td>
              <td>{stock.sector}</td>
              <td><input type="text" value={stock.price} onChange={(e) => handleChange(index, "price", e.target.value)} /></td>
              <td><input type="text" value={stock.range} onChange={(e) => handleChange(index, "range", e.target.value)} /></td>
              <td><input type="text" value={stock.yield} onChange={(e) => handleChange(index, "yield", e.target.value)} /></td>
              <td><input type="text" value={stock.pe} onChange={(e) => handleChange(index, "pe", e.target.value)} /></td>
              <td><input type="text" value={stock.notes} onChange={(e) => handleChange(index, "notes", e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px", fontSize: "20px" }}>💰 MMF vs Treasury Bill Calculator</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px", maxWidth: "600px" }}>
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
        <p>📊 <strong>Projected MMF Return (1 year):</strong> KES {mmfReturn.toFixed(2)}</p>
        <p>📊 <strong>Projected T-Bill Return ({duration} days):</strong> KES {tBillReturn.toFixed(2)}</p>
        <p>
          ✅ <strong>Better Option:</strong>{" "}
          {tBillReturn > mmfReturn * (duration / 365) ? "Treasury Bill" : "MMF"}
        </p>
      </div>
    </div>
  );
}

export default App;
