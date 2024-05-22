import React from "react";
import ReactDOM from "react-dom"; // Import ReactDOM từ "react-dom"
import App from "./App.jsx"; // Sử dụng extension phù hợp với file App
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
