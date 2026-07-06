import { useEffect } from "react";
import type { Route } from "./+types/auth";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";

export const meta = ({ }: Route.MetaArgs) => [
    { title: "Authentication" },
    {
        name: "description",
        content: "Log into your Account",
    },
];

export default function Auth() {
    // Zustand Store
    const { isLoading, auth } = usePuterStore();

    // React Router
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect after login
    const next =
        new URLSearchParams(location.search).get("next") ?? "/";

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next, { replace: true });
        }
    }, [auth.isAuthenticated, next, navigate]);

    return (
        <main
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-6"
            style={{
                backgroundImage: "url('/images/bg_cover.png')",
            }}
        >
            {/* Authentication Card */}
            <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200 p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Log In to continue your AI Resume Journey
                    </p>
                </div>

                {/* Login / Logout Button */}
                {isLoading ? (
                    <button
                        disabled
                        className="w-full rounded-xl bg-gray-900 py-4 text-lg font-semibold text-white animate-pulse"
                    >
                        Signing In...
                    </button>
                ) : auth.isAuthenticated ? (
                    <button
                        onClick={auth.signOut}
                        className="w-full rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 py-4 text-lg font-semibold text-white shadow-lg"
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        onClick={auth.signIn}
                        className="w-full rounded-xl bg-blue-600 hover:bg-gray-800 transition-all duration-300 py-4 text-lg font-semibold text-white shadow-xl hover:scale-[1.02]"
                    >
                        Log in
                    </button>
                )}
            </div>
        </main>
    );
}
