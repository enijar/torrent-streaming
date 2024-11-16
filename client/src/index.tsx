import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "@/components/app/app";

const root = document.querySelector("#root");

if (root === null) {
  throw new Error("No #root element");
}

ReactDOM.createRoot(root).render(
  <Router
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}
  >
    <App />
  </Router>,
);
