import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UploadProvider } from "./state/UploadContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UploadProvider>
      <App />
    </UploadProvider>
  </React.StrictMode>,
);
