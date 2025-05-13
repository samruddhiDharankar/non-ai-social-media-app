import { Children, createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext("light");

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (!darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");


        } else {

            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");

        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useDarkMode = () => useContext(ThemeContext);