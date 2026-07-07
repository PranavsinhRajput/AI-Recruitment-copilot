import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./state/ThemeContext";
import { UploadProvider } from "./state/UploadContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UploadProvider>
        <App />
      </UploadProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
