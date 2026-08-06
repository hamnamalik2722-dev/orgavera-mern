import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Account creation failed");
            }

            setMessage("Account created successfully. Redirecting to login...");

            window.setTimeout(() => {
                navigate("/login");
            }, 900);
        } catch (error) {
            setMessage(error.message || "Server se connection nahi ho raha");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="signup-page">
            <section className="signup-showcase">
                <div className="signup-showcase-overlay"></div>

                <Link to="/" className="signup-showcase-brand">
                    <img src="/orgavera-logo.png" alt="ORGAVERA logo" />

                    <div>
                        <strong>ORGAVERA</strong>
                        <span>Pure · Natural · Organic</span>
                    </div>
                </Link>

                <div className="signup-showcase-copy">
                    <p>JOIN THE ORGAVERA WORLD</p>

                    <h1>
                        Begin your
                        <em>botanical journey.</em>
                    </h1>

                    <span>
                        Create your customer account to enjoy a smoother and more personal
                        ORGAVERA shopping experience.
                    </span>
                </div>

                <div className="signup-showcase-points">
                    <span>✦ Secure registration</span>
                    <span>✦ Easy future checkout</span>
                    <span>✦ Customer account access</span>
                </div>
            </section>

            <section className="signup-panel">
                <Link to="/" className="signup-back-link">
                    <span>←</span>
                    Return to store
                </Link>

                <div className="signup-card">
                    <p className="signup-kicker">CREATE YOUR ACCOUNT</p>
                    <h2>Join ORGAVERA.</h2>

                    <p className="signup-subtitle">
                        Enter your details to create your secure customer account.
                    </p>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label>
                            <span>Full name</span>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </label>

                        <label>
                            <span>Email address</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </label>

                        <label>
                            <span>Password</span>
                            <div className="signup-password-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength="6"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <label>
                            <span>Confirm password</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength="6"
                                autoComplete="new-password"
                                required
                            />
                        </label>

                        <button type="submit" disabled={isLoading}>
                            <span>{isLoading ? "Creating account..." : "Create Account"}</span>
                            <b>→</b>
                        </button>
                    </form>

                    {message && (
                        <p
                            className={`signup-message ${message.startsWith("Account created") ? "success" : "error"
                                }`}
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    <div className="signup-login-link">
                        <span>Already have an account?</span>
                        <Link to="/login">Login here →</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Signup;