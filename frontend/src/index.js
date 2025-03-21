import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // Ensure this is correctly imported
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
      <App />
  );
} else {
  console.error("Root container not found!");
}
