import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css"; // File CSS utama (termasuk Tailwind CSS)
import { Provider } from "react-redux";
import Store from "./store/store"; // Redux Store

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Menyediakan Redux Store ke seluruh aplikasi */}
        <Provider store={Store}>
            {/* Mengaktifkan Client-Side Routing */}
            <BrowserRouter>
                {/* Menyediakan Konteks Tema */}
                <ThemeProvider>
                    {/* Komponen Aplikasi Utama */}
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);