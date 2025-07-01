import React, { useState } from "react";

const initialStocks = [
  { name: "Safaricom (SCOM)", sector: "Telco", price: "", range: "", yield: "", pe: "", notes: "" },
  { name: "Equity Bank (EQTY)", sector: "Banking", price: "", range: "", yield: "", pe: "", notes: "" },
  { name: "KCB Group", sector: "Banking", price: "", range: "", yield: "", pe: "", notes: "" },
  { name: "EABL", sector: "Consumer Goods", price: "", range: "", yield: "", pe: "", notes: "" },
  { name: "NSE ETF", sector: "Index Fund", price: "", range: "", yield: "", pe: "", notes: "" }
];

function App() {
  const [stocks, setStocks] = useState(initialStocks);

  const handleChange = (index, field, value) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  return (
    <div style={{ padding: "20px" }}>
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
              <td>
                <input
                  type="text"
                  value={stock.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={stock.range}
                  onChange={(e) => handleChange(index, "range", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={stock.yield}
                  onChange={(e) => handleChange(index, "yield", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={stock.pe}
                  onChange={(e) => handleChange(index, "pe", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={stock.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
