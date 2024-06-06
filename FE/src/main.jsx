import React from "react"; // Import ReactDOM từ "react-dom"
import App from "./App.jsx"; // Sử dụng extension phù hợp với file App
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();    
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
