import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import { AuthProvider } from "./hooks/use-auth.jsx";

import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);