import { useDarkMode } from "../context/ThemeContext"

function DarkModeToggler() {
    const { darkMode, setDarkMode } = useDarkMode();
    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="cursor-pointer"
            title="Toggle theme"
        >
            {darkMode ? "☀️" : "🌙"}
        </button>
    )
}

export default DarkModeToggler
