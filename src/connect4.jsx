import React from "react";
import App from "./component/connect4/App.jsx";
import "./scss/style.scss"; // import custom css (including bootstrap)
import * as bootstrap from "bootstrap"; // import bootstrap js
import { createRoot } from "react-dom/client";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(<App />);
