import React, { createContext, useContext, useState, useEffect } from "react"; // Mengimpor React dan hooks yang diperlukan untuk konteks tema

const ThemeContext = createContext(); // Membuat konteks untuk tema

export const ThemeProvider = ({ children }) => { // Mengekspor komponen provider tema
  const [theme, setTheme] = useState(() => { // Menggunakan useState dengan lazy initialization untuk tema
    return localStorage.getItem("theme") || "dark"; // Mengembalikan tema dari localStorage atau default "dark"
  });

  useEffect(() => { // Menggunakan useEffect untuk efek samping
    localStorage.setItem("theme", theme); // Menyimpan tema ke localStorage
    document.documentElement.setAttribute('data-theme', theme); // Mengatur atribut data-theme pada elemen root
  }, [theme]); // Dependensi pada theme

  const toggleTheme = () => { // Fungsi untuk toggle tema
    setTheme(theme === "dark" ? "light" : "dark"); // Mengubah tema dari dark ke light atau sebaliknya
  };

  return ( // Mengembalikan JSX
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); // Mengekspor hook untuk menggunakan konteks tema
