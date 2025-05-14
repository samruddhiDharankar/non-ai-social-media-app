import { useDarkMode } from "../context/ThemeContext"

function DarkModeToggler() {
    const { darkMode, setDarkMode } = useDarkMode();
    return (
        <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
        </button>
    )
}

export default DarkModeToggler
