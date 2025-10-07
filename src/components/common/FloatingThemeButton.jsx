// src/components/common/FloatingThemeButton.jsx

import React from 'react';
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

/**
 * Komponen Tombol Mengambang untuk mengubah tema (Dark/Light).
 */
const FloatingThemeButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        // Tetapkan posisi tombol di kanan bawah layar
        <div className="fixed bottom-6 right-6 z-50">
            {/* Tombol Dark/Light Theme */}
            <button
                onClick={toggleTheme}
                className={`p-3 rounded-full text-white shadow-lg transition duration-200 ${
                    theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                title={
                    theme === "dark" ? "Ubah ke Light Theme" : "Ubah ke Dark Theme"
                }
            >
                {theme === "dark" ? (
                    <FaSun className="text-xl text-yellow-300" />
                ) : (
                    <FaMoon className="text-xl text-gray-800" />
                )}
            </button>
        </div>
    );
};

export default FloatingThemeButton;