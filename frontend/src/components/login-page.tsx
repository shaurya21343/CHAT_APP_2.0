import React, { useState } from "react";
import useAuthStore from "../store/auth-store";



const Login: React.FC<{ toglePageFunction: () => void }> = ({ toglePageFunction }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { checkAuth } = useAuthStore();

    const handleLogin = async () => {
        if (!username || !password) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // important for cookies/JWT
            });


            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }
            console.log(res);

            // redirect later
            alert("Login successful 🎉");
            
            await checkAuth();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e1f22] text-gray-200">
            <div className="w-full max-w-md bg-[#313338] border border-black/30 rounded-xl shadow-lg p-6">
                {/* Header */}
                <h1 className="text-2xl font-semibold text-white mb-1">
                    Welcome back
                </h1>
                <p className="text-sm text-gray-400 mb-6">
                    Login to continue 🚀
                </p>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">
                            USERNAME
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[#1e1f22] border border-black/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                            placeholder="john_doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[#1e1f22] border border-black/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full mt-2 bg-[#5865f2] hover:bg-[#4752c4] transition text-white font-semibold py-2 rounded disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-400 mt-4">
                    Don't have an account?{" "}
                    <button onClick={toglePageFunction} className="text-[#5865f2] cursor-pointer hover:underline">
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
