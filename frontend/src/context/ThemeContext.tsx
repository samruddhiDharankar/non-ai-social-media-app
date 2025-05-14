import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define the context type
type ThemeContextType = {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider = ({ children }: ThemeProviderProps) => {
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

// Hook to use context (with safety check)
export const useDarkMode = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within a ThemeProvider");
    }
    return context;
};