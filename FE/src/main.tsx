import React from "react"; // Import ReactDOM từ "react-dom"
import App from "./App.tsx"; // Sử dụng extension phù hợp với file App
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.ts";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);
