import React from "react"; // Import ReactDOM từ "react-dom"
import App from "./App.jsx"; // Sử dụng extension phù hợp với file App
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
