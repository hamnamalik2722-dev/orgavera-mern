import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

const products = [
  {
    id: 1,
    name: "Herbal Hair Oil",
    category: "Hair Care",
    price: "Rs. 700",
    oldPrice: "Rs. 850",
    discount: "-18%",
    image: "/hair-oil.png",
  },
  {
    id: 2,
    name: "Herbal Shampoo",
    category: "Hair Care",
    price: "Rs. 600",
    oldPrice: "Rs. 750",
    discount: "-20%",
    image: "/shampoo.png",
  },
  {
    id: 3,
    name: "Brightening Serum",
    category: "Skin Care",
    price: "Rs. 850",
    oldPrice: "Rs. 1,000",
    discount: "-15%",
    image: "/serum.png",
  },
  {
    id: 4,
    name: "Glow Mask",
    category: "Skin Care",
    price: "Rs. 750",
    oldPrice: "Rs. 900",
    discount: "-17%",
    image: "/glow-mask.png",
  },
];

const skinCareProducts = [
  {
    id: "skin-1",
    name: "Brightening Serum",
    type: "Serum",
    price: "Rs. 850",
    image: "serum.png",
  },
  {
    id: "skin-2",
    name: "SunBlock ",
    type: "Face Mask",
    price: "Rs. 750",
    image: "glow-mask.png",
  },
  {
    id: "skin-3",
    name: "Herbal Face Wash",
    type: "Cleanser",
    price: "Rs. 650",
    image: "face wash.png",
  },
  {
    id: "skin-4",
    name: "Glow Mask",
    type: "Sun Care",
    price: "Rs. 800",
    image: "glow mask.png",
  },
  {
    id: "skin-5",
    name: "Night Repair Cream",
    type: "Night Care",
    price: "Rs. 900",
    image: "night cream.png",
  }

];

const hairCareProducts = [
  {
    id: "hair-1",
    name: "Herbal Hair Oil",
    type: "Hair Oil",
    price: "Rs. 700",
    image: "/hair-oil.png",
  },
  {
    id: "hair-2",
    name: "Herbal Shampoo",
    type: "Shampoo",
    price: "Rs. 600",
    image: "/shampoo.png",
  },
  {
    id: "hair-3",
    name: "Herbal Conditioner",
    type: "Conditioner",
    price: "Rs. 700",
    image: "/conditioner.png",
  },
];

function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [checkoutStep, setCheckoutStep] = useState(1);

  const getNumericPrice = (price) => Number(String(price).replace(/[^0-9]/g, "")) || 0;

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to cart`);
    setCheckoutStep(1);
    setIsCartOpen(true);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const updateQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getNumericPrice(item.price) * item.quantity, 0),
    [cart]
  );

  const placeWhatsAppOrder = (number) => {
    if (!cart.length) {
      setNotice("Your cart is empty");
      return;
    }

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setNotice("Please enter name, phone and delivery address");
      return;
    }

    const productLines = cart
      .map((item) => `• ${item.name} × ${item.quantity} — Rs. ${getNumericPrice(item.price) * item.quantity}`)
      .join("\n");

    const message = `🌿 ORGAVERA ORDER\n\nCustomer Name: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}\n\nProducts:\n${productLines}\n\nTotal: Rs. ${cartTotal}\n\nPlease confirm my order. Thank you!`;

    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="website">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <a href="#home" className="brand">
          <img src="/orgavera-logo.png" alt="ORGAVERA logo" />

          <div className="brand-name">
            <h2>ORGAVERA</h2>
            <span>Pure · Natural · Organic</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#story">Our Story</a>
          <a href="#ingredients">Ingredients</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar-actions">
          <Link
            to="/login"
            className="navbar-button login-nav-button"
            aria-label="Login to your ORGAVERA account"
          >
            <span className="login-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4.5 21c.7-4.4 3.2-6.8 7.5-6.8s6.8 2.4 7.5 6.8"></path>
              </svg>
            </span>

            <span className="login-nav-copy">
              <small>MY ACCOUNT</small>
              <strong>LOGIN</strong>
            </span>

            <span className="login-nav-arrow" aria-hidden="true">↗</span>
          </Link>

          <button type="button" className="navbar-button cart-nav-button" onClick={() => setIsCartOpen(true)}>
            Cart
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}

        <section className="hero" id="home">
          <picture className="hero-picture">
            <source
              media="(max-width: 768px)"
              srcSet="/hero-mobile.webp.png"
            />

            <img
              src="/orgavera -hero.png.png"
              alt="ORGAVERA organic skincare and haircare products"
              className="hero-image"
            />
          </picture>

          <div className="hero-overlay"></div>
          <div className="hero-bottom-gradient"></div>

          <div className="hero-container">
            <div className="hero-content">
              <p className="hero-label">
                Botanical Beauty · Made With Care
              </p>

              <h1>
                Nature Meets Science.
                <br />
                <em>Beauty Meets You.</em>
              </h1>

              <p className="hero-description">
                Premium herbal skincare and haircare thoughtfully created for
                healthier-looking skin, hair and everyday self-care.
              </p>

              <div className="hero-buttons">
                <a href="#products" className="primary-button">
                  Explore Collection
                  <span>↗</span>
                </a>

                <a href="#story" className="secondary-button">
                  Discover Our Story
                </a>
              </div>
            </div>
          </div>

          <div className="scroll-indicator">
            <span></span>
            Scroll to discover
          </div>
        </section>

        {/* ================= MOVING TEXT ================= */}

        <section className="marquee">
          <div className="marquee-track">
            <span>Premium Botanical Skincare</span>
            <b>✦</b>

            <span>Clean Beauty</span>
            <b>✦</b>

            <span>Cruelty-Free</span>
            <b>✦</b>

            <span>Sulfate & Paraben Free</span>
            <b>✦</b>

            <span>Handmade in Small Batches</span>
            <b>✦</b>

            <span>Inspired by Nature</span>
            <b>✦</b>
          </div>
        </section>

        {/* ================= TOP SELLERS ================= */}

        <section className="top-sellers-section" id="top-sellers">
          <div className="top-sellers-heading reveal">
            <div className="top-sellers-kicker">
              <span></span>
              <b>✦</b>
              <p>TOP SELLERS</p>
              <span></span>
            </div>

            <h2>
              Our <em>Best Sellers</em>
            </h2>

            <p className="top-sellers-description">
              Loved by our customers. Made with nature. Created for beautiful
              everyday rituals.
            </p>
          </div>

          <div className="top-sellers-grid">
            {products.map((product) => (
              <article className="top-seller-card reveal" key={product.id}>
                <div className="top-seller-image-wrap">
                  <span className="discount-badge">{product.discount}</span>

                  <img
                    src={product.image}
                    alt={`${product.name} by ORGAVERA`}
                    className={`top-seller-image top-seller-image-${product.id}`}
                    loading={product.id <= 2 ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />

                  <div className="top-seller-image-shade" aria-hidden="true"></div>

                  <button
                    type="button"
                    className="top-seller-cart"
                    aria-label={`Add ${product.name} to cart`}
                    title={`Add ${product.name} to cart`}
                    onClick={() => addToCart(product)}
                  >
                    🛒
                  </button>
                </div>

                <div className="top-seller-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>

                  <div className="top-seller-divider">
                    <span></span>
                    <b>❧</b>
                    <span></span>
                  </div>

                  <div className="top-seller-price">
                    <strong>{product.price}</strong>
                    <span>{product.oldPrice}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="top-sellers-action reveal">
            <a href="#products" className="top-sellers-button">
              View All Products
              <span>→</span>
            </a>
          </div>
        </section>

        {/* ================= INTRO ================= */}

        <section className="intro" id="story">
          <div className="intro-orbit intro-orbit-one"></div>
          <div className="intro-orbit intro-orbit-two"></div>

          <div className="intro-topline reveal">
            <span>01 / OUR PHILOSOPHY</span>
            <span>THE ORGAVERA DIFFERENCE</span>
          </div>

          <div className="intro-layout">
            <div className="intro-copy reveal">
              <p className="section-label">BOTANICAL CARE, BEAUTIFULLY REFINED</p>

              <h2>
                Thoughtful care,
                <br />
                <em>made for real routines.</em>
              </h2>

              <p className="intro-lead">
                ORGAVERA blends traditional botanicals with a modern approach
                to create skincare and haircare that feels simple, beautiful
                and easy to trust.
              </p>

              <div className="intro-benefits">
                <div><span>01</span><p>Botanical ingredients selected with purpose</p></div>
                <div><span>02</span><p>Small-batch care for everyday use</p></div>
                <div><span>03</span><p>Clear choices for skin and hair rituals</p></div>
              </div>

              <div className="intro-actions">
                <a href="#products" className="primary-button">
                  Explore Products
                  <span>↗</span>
                </a>

                <a href="#ingredients" className="intro-text-link">
                  Discover our ingredients
                  <span>→</span>
                </a>
              </div>
            </div>

            <div className="intro-visual reveal">
              <div className="intro-card intro-card-main">
                <img src="/orgavera-logo.png" alt="ORGAVERA botanical care" />
                <div>
                  <p>PURE · NATURAL · ORGANIC</p>
                  <h3>Care that feels considered.</h3>
                </div>
              </div>

              <div className="intro-card intro-card-note">
                <span>OUR PROMISE</span>
                <p>
                  Honest botanical care designed to become a meaningful part
                  of your everyday routine.
                </p>
              </div>

              <a href="#ingredients" className="intro-round-button">
                <span>Our<br />Approach</span>
                <b>↗</b>
              </a>
            </div>
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}

        <section className="products-section" id="products">
          <div className="products-heading reveal">
            <div>
              <p className="section-label">OUR COLLECTION</p>

              <h2>
                Everyday
                <br />
                <em>rituals.</em>
              </h2>
            </div>

            <p>
              Explore our complete collection arranged into simple skincare
              and haircare rows.
            </p>
          </div>

          <div className="collection-group reveal">
            <div className="collection-row-heading">
              <div>
                <span>01</span>
                <p>SKIN CARE</p>
              </div>

              <small>7 botanical essentials</small>
            </div>

            <div className="collection-scroll">
              {skinCareProducts.map((product) => (
                <article className="collection-card" key={product.id}>
                  <div className="collection-image-wrap">
                    <img
                      src={product.image}
                      alt={`${product.name} by ORGAVERA`}
                      className="collection-image"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/orgavera-logo.png";
                        event.currentTarget.classList.add("collection-image-fallback");
                      }}
                    />

                    <button
                      type="button"
                      className="collection-order"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>

                  <div className="collection-card-info">
                    <p>{product.type}</p>
                    <h3>{product.name}</h3>
                    <strong>{product.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="collection-group reveal">
            <div className="collection-row-heading">
              <div>
                <span>02</span>
                <p>HAIR CARE</p>
              </div>

              <small>3 herbal essentials</small>
            </div>

            <div className="collection-scroll collection-scroll-hair">
              {hairCareProducts.map((product) => (
                <article className="collection-card" key={product.id}>
                  <div className="collection-image-wrap">
                    <img
                      src={product.image}
                      alt={`${product.name} by ORGAVERA`}
                      className="collection-image"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/orgavera-logo.png";
                        event.currentTarget.classList.add("collection-image-fallback");
                      }}
                    />

                    <button
                      type="button"
                      className="collection-order"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>

                  <div className="collection-card-info">
                    <p>{product.type}</p>
                    <h3>{product.name}</h3>
                    <strong>{product.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STORY SECTION ================= */}

        <section className="story-section reveal">
          <div className="story-visual">
            <div className="story-ring"></div>

            <div className="story-logo-card">
              <img src="/orgavera-logo.png" alt="ORGAVERA logo" />
            </div>
          </div>

          <div className="story-text">
            <p className="section-label">02 / OUR STORY</p>

            <h2>
              From nature,
              <br />
              <em>with purpose.</em>
            </h2>

            <div className="gold-line"></div>

            <p>
              ORGAVERA began with a simple belief: personal care should feel
              honest, beautiful and connected to nature.
            </p>

            <p>
              We use familiar botanicals and transform them into thoughtfully
              prepared products for modern skincare and haircare routines.
            </p>

            <a href="#contact" className="text-link">
              Meet the brand →
            </a>
          </div>
        </section>

        {/* ================= INGREDIENTS ================= */}

        <section className="ingredients-section" id="ingredients">
          <div className="ingredients-glow ingredients-glow-one"></div>
          <div className="ingredients-glow ingredients-glow-two"></div>

          <div className="ingredients-heading reveal">
            <p className="section-label">03 / FORMULA PHILOSOPHY</p>

            <h2>
              Tradition meets
              <br />
              <em>modern formulation.</em>
            </h2>

            <p className="ingredients-intro">
              We pair time-honoured herbs and botanical powders with carefully
              selected cosmetic-grade and food-grade functional ingredients,
              used only where suitable and in thoughtfully measured amounts.
            </p>

            <div className="formula-tags">
              <span>Botanical Powders</span>
              <span>Herbal Extracts</span>
              <span>Skin-Safe Actives</span>
              <span>Balanced Formulas</span>
            </div>

            <div className="formula-note">
              <b>Our approach</b>
              <p>
                Every ingredient has a purpose: performance, texture,
                preservation or comfort — never added without reason.
              </p>
            </div>
          </div>

          <div className="ingredient-list">
            <details className="ingredient-item reveal">
              <summary>
                <span className="ingredient-number">01</span>
                <span className="ingredient-main">
                  <small>BOTANICAL HYDRATION</small>
                  <strong>Aloe Vera</strong>
                  <em>Fresh, soothing and naturally comforting.</em>
                </span>
                <span className="ingredient-icon">+</span>
              </summary>
              <p className="ingredient-detail">
                Chosen to support a soft, refreshed feel in everyday skincare
                and haircare rituals.
              </p>
            </details>

            <details className="ingredient-item reveal">
              <summary>
                <span className="ingredient-number">02</span>
                <span className="ingredient-main">
                  <small>TRADITIONAL HERB</small>
                  <strong>Hibiscus</strong>
                  <em>A much-loved botanical in traditional hair rituals.</em>
                </span>
                <span className="ingredient-icon">+</span>
              </summary>
              <p className="ingredient-detail">
                Used in selected hair formulas for a rich botanical character
                and a naturally cared-for finish.
              </p>
            </details>

            <details className="ingredient-item reveal">
              <summary>
                <span className="ingredient-number">03</span>
                <span className="ingredient-main">
                  <small>HERBAL PURITY</small>
                  <strong>Neem</strong>
                  <em>A familiar ingredient in traditional herbal care.</em>
                </span>
                <span className="ingredient-icon">+</span>
              </summary>
              <p className="ingredient-detail">
                Carefully blended into targeted products where a clean,
                herbal profile is desired.
              </p>
            </details>

            <details className="ingredient-item reveal">
              <summary>
                <span className="ingredient-number">04</span>
                <span className="ingredient-main">
                  <small>NATURAL COMFORT</small>
                  <strong>Honey</strong>
                  <em>Naturally comforting for gentle body care.</em>
                </span>
                <span className="ingredient-icon">+</span>
              </summary>
              <p className="ingredient-detail">
                Selected for formulas designed to leave skin feeling smooth,
                soft and pampered.
              </p>
            </details>

            <details className="ingredient-item reveal">
              <summary>
                <span className="ingredient-number">05</span>
                <span className="ingredient-main">
                  <small>MODERN ACTIVE</small>
                  <strong>Niacinamide</strong>
                  <em>A cosmetic-grade active used in balanced skincare.</em>
                </span>
                <span className="ingredient-icon">+</span>
              </summary>
              <p className="ingredient-detail">
                Added in carefully measured amounts to support the intended
                performance and feel of selected formulas.
              </p>
            </details>

            <details className="ingredient-item reveal">
              <summary>
                <span className="ingredient-number">06</span>
                <span className="ingredient-main">
                  <small>FORMULA SUPPORT</small>
                  <strong>Functional Ingredients</strong>
                  <em>Texture, stability and preservation with purpose.</em>
                </span>
                <span className="ingredient-icon">+</span>
              </summary>
              <p className="ingredient-detail">
                Suitable cosmetic-grade or food-grade ingredients may be used
                where appropriate to improve texture, stability, preservation
                and the overall product experience.
              </p>
            </details>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}

        <section className="final-section reveal">
          <div className="final-ring"></div>

          <img
            src="/orgavera-logo.png"
            alt="ORGAVERA"
            className="final-logo"
          />

          <p className="section-label">YOUR DAILY BOTANICAL RITUAL</p>

          <h2>
            Let nature
            <br />
            <em>stay awhile.</em>
          </h2>

          <a href="#products" className="primary-button">
            Shop ORGAVERA
            <span>↗</span>
          </a>
        </section>
      </main>


      {notice && <div className="cart-notice" role="status">{notice}</div>}

      <div
        className={`cart-backdrop ${isCartOpen ? "show" : ""}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden={!isCartOpen}
      ></div>

      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <div className="cart-title-wrap">
            <span>YOUR BOTANICAL BAG</span>
            <h3>{checkoutStep === 1 ? "Review Your Order" : checkoutStep === 2 ? "Delivery Details" : "Complete on WhatsApp"}</h3>
            <p>{cartCount} {cartCount === 1 ? "product" : "products"} selected</p>
          </div>
          <button type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">×</button>
        </div>

        <div className="cart-drawer-body premium-step-body">
          {!cart.length ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">❧</div>
              <h4>Your ritual begins here</h4>
              <p>Add your favourite ORGAVERA products and place the order directly through WhatsApp.</p>
              <button type="button" onClick={() => setIsCartOpen(false)}>Explore Products</button>
            </div>
          ) : (
            <>
              <div className="cart-progress" aria-label="Checkout progress">
                <div className={`cart-progress-step ${checkoutStep >= 1 ? "active" : ""}`}><b>1</b><span>Review</span></div>
                <i></i>
                <div className={`cart-progress-step ${checkoutStep >= 2 ? "active" : ""}`}><b>2</b><span>Details</span></div>
                <i></i>
                <div className={`cart-progress-step ${checkoutStep >= 3 ? "active" : ""}`}><b>3</b><span>WhatsApp</span></div>
              </div>

              {checkoutStep === 1 && (
                <section className="checkout-step checkout-review-step">
                  <div className="cart-section-title large-summary-title">
                    <div><span>01</span><h4>Complete Order Summary</h4></div>
                    <small>{cartCount} {cartCount === 1 ? "item" : "items"}</small>
                  </div>

                  <div className="cart-items expanded-cart-items">
                    {cart.map((item) => (
                      <article className="cart-item premium-cart-item" key={item.id}>
                        <div className="cart-item-image-wrap"><img src={item.image} alt={item.name} /></div>
                        <div className="cart-item-copy">
                          <small>{item.category || item.type || "ORGAVERA Care"}</small>
                          <h4>{item.name}</h4>
                          <p>{item.price} each</p>
                          <div className="cart-quantity" aria-label={`Quantity of ${item.name}`}>
                            <button type="button" onClick={() => updateQuantity(item.id, -1)}>−</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                        </div>
                        <strong className="cart-line-total">Rs. {getNumericPrice(item.price) * item.quantity}</strong>
                        <button type="button" className="cart-remove" onClick={() => removeFromCart(item.id)}>×</button>
                      </article>
                    ))}
                  </div>

                  <div className="review-total-card">
                    <div><span>Subtotal</span><b>Rs. {cartTotal}</b></div>
                    <div><span>Delivery charges</span><b>Confirmed on WhatsApp</b></div>
                    <div className="review-grand-total"><span>Total Amount</span><strong>Rs. {cartTotal}</strong></div>
                  </div>

                  <button type="button" className="checkout-next-button" onClick={() => setCheckoutStep(2)}>
                    Continue to Delivery Details <span>→</span>
                  </button>
                </section>
              )}

              {checkoutStep === 2 && (
                <section className="checkout-step checkout-details-step">
                  <button type="button" className="checkout-back-button" onClick={() => setCheckoutStep(1)}>← Back to order summary</button>
                  <div className="cart-section-title large-summary-title">
                    <div><span>02</span><h4>Delivery Details</h4></div><small>Required</small>
                  </div>

                  <div className="checkout-form premium-checkout-form">
                    <label className="checkout-field"><span className="checkout-field-icon">♙</span><div><small>Full name</small><input type="text" placeholder="Enter customer name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></div></label>
                    <label className="checkout-field"><span className="checkout-field-icon">☎</span><div><small>Phone number</small><input type="tel" placeholder="03XX XXXXXXX" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></div></label>
                    <label className="checkout-field checkout-address-field"><span className="checkout-field-icon">⌖</span><div><small>Complete delivery address</small><textarea placeholder="House, street, area and city" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })}></textarea></div></label>
                    <div className="cart-trust-card"><span>✓</span><div><strong>Private & secure order</strong><p>Your details are only included in your WhatsApp order message.</p></div></div>
                  </div>

                  <button type="button" className="checkout-next-button" onClick={() => {
                    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
                      setNotice("Please enter name, phone and delivery address");
                      window.setTimeout(() => setNotice(""), 2200);
                      return;
                    }
                    setCheckoutStep(3);
                  }}>Review & Choose WhatsApp <span>→</span></button>
                </section>
              )}

              {checkoutStep === 3 && (
                <section className="checkout-step whatsapp-final-step">
                  <button type="button" className="checkout-back-button" onClick={() => setCheckoutStep(2)}>← Edit delivery details</button>
                  <div className="final-order-card">
                    <span>ORDER READY</span><h4>Your ORGAVERA order is complete</h4>
                    <p>{customer.name} · {customer.phone}</p><small>{customer.address}</small>
                    <div><em>Total</em><strong>Rs. {cartTotal}</strong></div>
                  </div>
                  <p className="whatsapp-order-note">Choose either ORGAVERA number below. Your complete order summary will open directly in WhatsApp for confirmation.</p>
                  <div className="compact-whatsapp-options">
                    <button type="button" className="whatsapp-checkout" onClick={() => placeWhatsAppOrder("923709301194")}><span className="whatsapp-button-icon">◉</span><span><b>Order on WhatsApp</b><small>+92 370 9301194</small></span><em>→</em></button>
                    <button type="button" className="whatsapp-checkout secondary-whatsapp" onClick={() => placeWhatsAppOrder("923379912484")}><span className="whatsapp-button-icon">◉</span><span><b>Alternative WhatsApp</b><small>+92 337 9912484</small></span><em>→</em></button>
                  </div>
                  <div className="cart-footer-promises"><span>❧ Thoughtfully Made</span><span>✦ Direct Confirmation</span><span>⌂ Pakistan Delivery</span></div>
                </section>
              )}
            </>
          )}
        </div>
      </aside>

      {/* ================= PREMIUM CONTACT / FOOTER ================= */}
      <footer id="contact" className="premium-footer">
        <div className="footer-glow footer-glow-one" aria-hidden="true"></div>
        <div className="footer-glow footer-glow-two" aria-hidden="true"></div>

        <div className="footer-shell">
          <section className="footer-contact-panel reveal">
            <div className="footer-contact-copy">
              <p className="footer-kicker">LET'S STAY CONNECTED</p>

              <h2>
                Your botanical care,
                <br />
                <em>just a message away.</em>
              </h2>

              <p className="footer-contact-text">
                Need product guidance or want to place an order? Connect with
                ORGAVERA directly through WhatsApp or visit our social pages.
              </p>

              <div className="footer-mini-points">
                <span>✦ Personal product guidance</span>
                <span>✦ Direct WhatsApp ordering</span>
                <span>✦ Delivery across Pakistan</span>
              </div>
            </div>

            <div className="footer-contact-actions">
              <a
                href="https://wa.me/923709301194"
                target="_blank"
                rel="noreferrer"
                className="footer-contact-card footer-contact-card-primary"
              >
                <span className="footer-contact-icon">W</span>
                <span className="footer-contact-card-text">
                  <small>ORDER & SUPPORT</small>
                  <strong>WhatsApp 1</strong>
                  <p>+92 370 9301194</p>
                </span>
                <b>↗</b>
              </a>

              <a
                href="https://wa.me/923379912484"
                target="_blank"
                rel="noreferrer"
                className="footer-contact-card"
              >
                <span className="footer-contact-icon">W</span>
                <span className="footer-contact-card-text">
                  <small>ALTERNATIVE NUMBER</small>
                  <strong>WhatsApp 2</strong>
                  <p>+92 337 9912484</p>
                </span>
                <b>↗</b>
              </a>

              <div className="footer-social-grid">
                <a
                  href="https://www.instagram.com/orgavera?igsh=MTQwaWp3NWRndXc1Mw=="
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-card"
                >
                  <span>Instagram</span>
                  <b>↗</b>
                </a>

                <a
                  href="https://www.facebook.com/share/1GuDQJkn9n/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-card"
                >
                  <span>Facebook</span>
                  <b>↗</b>
                </a>

                <a
                  href="https://www.tiktok.com/@organicherbelcosmatics?_r=1&_t=ZS-98TSiDvTEmr"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-card footer-social-card-wide"
                >
                  <span>TikTok</span>
                  <small>@organicherbelcosmatics</small>
                  <b>↗</b>
                </a>
              </div>
            </div>
          </section>

          <div className="footer-divider"></div>

          <section className="footer-navigation">
            <div className="footer-brand-premium">
              <a href="#home" className="footer-logo-wrap">
                <img src="/orgavera-logo.png" alt="ORGAVERA" />
              </a>

              <div>
                <h3>ORGAVERA</h3>
                <p>Pure · Natural · Organic</p>
              </div>
            </div>

            <div className="footer-links-group">
              <p>EXPLORE</p>
              <a href="#home">Home <span>↗</span></a>
              <a href="#products">Products <span>↗</span></a>
              <a href="#story">Our Story <span>↗</span></a>
              <a href="#ingredients">Ingredients <span>↗</span></a>
            </div>

            <div className="footer-links-group">
              <p>CONTACT</p>
              <a href="https://wa.me/923709301194" target="_blank" rel="noreferrer">
                WhatsApp 1 <span>↗</span>
              </a>
              <a href="https://wa.me/923379912484" target="_blank" rel="noreferrer">
                WhatsApp 2 <span>↗</span>
              </a>
              <a
                href="https://www.instagram.com/orgavera?igsh=MTQwaWp3NWRndXc1Mw=="
                target="_blank"
                rel="noreferrer"
              >
                Instagram <span>↗</span>
              </a>
              <a
                href="https://www.tiktok.com/@organicherbelcosmatics?_r=1&_t=ZS-98TSiDvTEmr"
                target="_blank"
                rel="noreferrer"
              >
                TikTok <span>↗</span>
              </a>
            </div>

            <div className="footer-newsletter-premium">
              <p>STAY CLOSE</p>
              <h4>Join the ORGAVERA world.</h4>
              <span>
                Product launches, restocks and botanical care updates.
              </span>

              <form onSubmit={(event) => event.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe">↗</button>
              </form>

              <small>No spam. Just thoughtful updates.</small>
            </div>
          </section>

          <div className="footer-bottom-premium">
            <span>© 2026 ORGAVERA. All Rights Reserved.fagzv</span>

            <span>BOTANICAL BEAUTY · THOUGHTFULLY MADE</span>
            <span>RAWALPINDI · PAKISTAN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;