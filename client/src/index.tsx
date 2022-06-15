import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "@/components/app/app";

console.log(0);

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Router>
    <App />
  </Router>
);
