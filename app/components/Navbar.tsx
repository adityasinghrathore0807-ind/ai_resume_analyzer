import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-8 py-5">
            <Link to="/">
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Resume AI Checker
                </p>
            </Link>

            <Link
                to="/upload"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all duration-300 shadow-lg"
            >
                Upload Resume
            </Link>
        </nav>
    )
}

export default Navbar
