import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const redirectTarget = sessionStorage.redirectPath;

if (redirectTarget && redirectTarget !== window.location.href) {
  try {
    const url = new URL(redirectTarget);
    const newPath = url.pathname + url.search + url.hash;
    sessionStorage.removeItem("redirectPath");
    window.history.replaceState(null, "", newPath);
  } catch (error) {
    sessionStorage.removeItem("redirectPath");
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
