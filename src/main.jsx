import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CompanyProvider } from "./contexts/CompanyContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Element #root introuvable");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CompanyProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{ duration: 3500 }}
            />
          </CompanyProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
