import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./hoverRing.js";

// A refresh always starts at the top: no restored scroll position, and no #section anchor to jump to (the admin's hash stays).
history.scrollRestoration = "manual";
if (location.hash && location.hash !== "#/admin-LFG") history.replaceState(null, "", location.pathname + location.search);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
