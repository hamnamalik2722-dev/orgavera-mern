import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage("Login successful. Redirecting...");

            window.setTimeout(() => {
                navigate("/");
            }, 700);
        } catch (error) {
            setMessage(error.message || "Server se connection nahi ho raha");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-showcase">
                <div className="login-showcase-overlay"></div>

                <Link to="/" className="login-showcase-brand">
                    <img src="/orgavera-logo.png" alt="ORGAVERA logo" />

                    <div>
                        <strong>ORGAVERA</strong>
                        <span>Pure · Natural · Organic</span>
                    </div>
                </Link>

                <div className="login-showcase-copy">
                    <p>BOTANICAL BEAUTY · THOUGHTFULLY MADE</p>

                    <h1>
                        Welcome back to
                        <em>your natural ritual.</em>
                    </h1>

                    <span>
                        Sign in to continue your ORGAVERA shopping experience and access
                        your account securely.
                    </span>
                </div>

                <div className="login-showcase-points">
                    <span>✦ Secure customer account</span>
                    <span>✦ Premium botanical care</span>
                    <span>✦ Simple shopping experience</span>
                </div>
            </section>

            <section className="login-panel">
                <Link to="/" className="login-back-link">
                    <span>←</span>
                    Return to store
                </Link>

                <div className="login-card">
                    <div className="login-mobile-brand">
                        <img src="/orgavera-logo.png" alt="ORGAVERA" />

                        <div>
                            <strong>ORGAVERA</strong>
                            <span>Pure · Natural · Organic</span>
                        </div>
                    </div>

                    <p className="login-kicker">ORGAVERA ACCOUNT</p>
                    <h2>Welcome back.</h2>

                    <p className="login-subtitle">
                        Enter your account details to continue.
                    </p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label>
                            <span>Email address</span>

                            <div className="login-input-wrap">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3 6.5h18v11H3z"></path>
                                    <path d="m4 7 8 6 8-6"></path>
                                </svg>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </label>

                        <label>
                            <span>Password</span>

                            <div className="login-input-wrap">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="5" y="10" width="14" height="10" rx="2"></rect>
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
                                </svg>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    minLength="6"
                                    required
                                />

                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <button
                            type="submit"
                            className="login-submit-button"
                            disabled={isLoading}
                        >
                            <span>{isLoading ? "Logging in..." : "Login to ORGAVERA"}</span>
                            <b>→</b>
                        </button>
                    </form>

                    {message && (
                        <p
                            className={`login-message ${message.startsWith("Login successful") ? "success" : "error"
                                }`}
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    <div className="login-divider">
                        <span></span>
                        <b>✦</b>
                        <span></span>
                    </div>

                    <div className="login-signup-box">
                        <div>
                            <small>NEW TO ORGAVERA?</small>
                            <p>Create an account for a faster and easier shopping experience.</p>
                        </div>

                        <Link to="/signup" className="login-create-account">
                            <span>Create Account</span>
                            <b>→</b>
                        </Link>
                    </div>

                    <p className="login-support">
                        Need help with your account? Contact ORGAVERA through WhatsApp.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Login;