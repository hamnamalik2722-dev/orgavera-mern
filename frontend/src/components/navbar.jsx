function Navbar() {
    return (
        <header className="navbar">

            <div className="logo">
                <span>ORGA</span>VERA
            </div>

            <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/products">Shop</a>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
            </nav>

            <div className="nav-actions">
                <button className="icon-btn">♡</button>
                <button className="icon-btn">🛒</button>
                <button className="login-btn">Login</button>
            </div>

        </header>
    );
}

export default Navbar;