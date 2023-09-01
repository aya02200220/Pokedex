// themeContext.js
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const themes = {
    light: {
      background: "#222222",
      color: "#000000",
      // 他のライトモードのスタイルがここに追加できます
    },
    dark: {
      background: "#222222",
      color: "#6666",
      // 他のダークモードのスタイルがここに追加できます
    },
  };

  const currentTheme = darkMode ? themes.dark : themes.light;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleDarkMode, theme: currentTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
