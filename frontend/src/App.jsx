


import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Admin from "./Admin.jsx";

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

const defaultAdminCatalog = {
  skincare: skinCareProducts.map((item) => ({ ...item, description: item.description || "" })),
  haircare: hairCareProducts.map((item) => ({ ...item, description: item.description || "" })),
  soaps: [
    {
      id: "soap-1",
      name: "Loofah Honey Soap",
      type: "Handcrafted Soap",
      price: "Rs. 450",
      image: "/soap-loofah-honey.png",
      description: "A handcrafted botanical cleansing bar for an everyday body-care ritual.",
    },
    {
      id: "soap-2",
      name: "Turmeric Soap",
      type: "Botanical Soap",
      price: "Rs. 400",
      image: "/soap-turmeric.png",
      description: "A small-batch botanical cleansing bar with a simple herbal profile.",
    },
    {
      id: "soap-3",
      name: "Neem Soap",
      type: "Herbal Soap",
      price: "Rs. 400",
      image: "/soap-neem.png",
      description: "A herbal cleansing bar inspired by traditional botanical care.",
    },
  ],
  ingredients: [
    {
      id: "ingredient-1",
      name: "Niacinamide",
      type: "Skincare Active",
      price: "Ask for price",
      image: "/niacinamide.png",
      description: "A cosmetic-grade active for selected skincare formulations.",
    },
    {
      id: "ingredient-2",
      name: "Alpha Arbutin",
      type: "Skincare Active",
      price: "Ask for price",
      image: "/alpha-arbutin.png",
      description: "A formulation ingredient for selected skincare products.",
    },
    {
      id: "ingredient-3",
      name: "Stearic Acid",
      type: "Texture & Structure",
      price: "Ask for price",
      image: "/stearic-acid.png",
      description: "A formulation essential used where suitable for structure and texture.",
    },
  ],
  classes: [
    {
      id: "class-1",
      name: "Herbal Skincare Formulation",
      type: "Hands-on Class",
      price: "Book a seat",
      image: "/skincare-class.png",
      description: "A practical guided session covering the basics of skincare formulation.",
    },
    {
      id: "class-2",
      name: "Haircare Formulation Workshop",
      type: "Practical Workshop",
      price: "Book a seat",
      image: "/haircare-class.png",
      description: "A hands-on learning session focused on practical haircare formulation.",
    },
    {
      id: "class-3",
      name: "Artisan Soap Making Class",
      type: "Hands-on Class",
      price: "Book a seat",
      image: "/soap-class.png",
      description: "Learn the basic process and workflow behind handcrafted soap making.",
    },
  ],
};


const normalizePublicImagePath = (value) => {
  const image = String(value || "").trim().replace(/\\/g, "/");

  if (!image) return "/orgavera-logo.png";
  if (/^(https?:|data:|blob:)/i.test(image)) return image;

  // Images stored in Vite's public folder must be referenced from the site root.
  // This also repairs older admin entries such as "soap.jpg" when opened on
  // nested routes like /collection/soaps.
  return image.startsWith("/") ? image : `/${image.replace(/^\.\//, "")}`;
};

const categoryPageConfig = {
  soaps: {
    number: "03",
    eyebrow: "HANDCRAFTED CLEANSING",
    title: "Artisan Soaps",
    storageKey: "soaps",
  },
  ingredients: {
    number: "04",
    eyebrow: "FORMULATION ESSENTIALS",
    title: "Cosmetic Ingredients",
    storageKey: "ingredients",
  },
  classes: {
    number: "05",
    eyebrow: "LEARN WITH ORGAVERA",
    title: "Book a Class",
    storageKey: "classes",
  },
};


function Home() {
  const CART_STORAGE_KEY = "orgaveraCart";

  const readSavedCart = () => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Could not load saved cart:", error);
      return [];
    }
  };

  const [cart, setCart] = useState(readSavedCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Keep the homepage category product sections in sync with the Admin Panel.
  const readAdminCatalog = () => {
    try {
      const saved = window.localStorage.getItem("orgaveraAdminCatalog");
      if (!saved) return defaultAdminCatalog;
      const parsed = JSON.parse(saved);
      return {
        skincare: Array.isArray(parsed.skincare) ? parsed.skincare : defaultAdminCatalog.skincare,
        haircare: Array.isArray(parsed.haircare) ? parsed.haircare : defaultAdminCatalog.haircare,
        soaps: Array.isArray(parsed.soaps) ? parsed.soaps : defaultAdminCatalog.soaps,
        ingredients: Array.isArray(parsed.ingredients)
          ? parsed.ingredients
          : defaultAdminCatalog.ingredients,
        classes: Array.isArray(parsed.classes) ? parsed.classes : defaultAdminCatalog.classes,
      };
    } catch (error) {
      console.error("Could not load admin catalog:", error);
      return defaultAdminCatalog;
    }
  };

  const [adminCatalog, setAdminCatalog] = useState(readAdminCatalog);

  const updateCart = (updater) => {
    setCart((currentCart) => {
      const nextCart =
        typeof updater === "function" ? updater(currentCart) : updater;

      try {
        window.localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(nextCart)
        );
      } catch (error) {
        console.error("Could not save cart:", error);
      }

      return nextCart;
    });
  };

  useEffect(() => {
    const syncCartFromStorage = () => {
      setCart(readSavedCart());
    };

    window.addEventListener("pageshow", syncCartFromStorage);
    window.addEventListener("storage", syncCartFromStorage);

    return () => {
      window.removeEventListener("pageshow", syncCartFromStorage);
      window.removeEventListener("storage", syncCartFromStorage);
    };
  }, []);

  useEffect(() => {
    const refreshCatalog = () => setAdminCatalog(readAdminCatalog());
    window.addEventListener("storage", refreshCatalog);
    window.addEventListener("orgavera-catalog-updated", refreshCatalog);
    window.addEventListener("pageshow", refreshCatalog);

    return () => {
      window.removeEventListener("storage", refreshCatalog);
      window.removeEventListener("orgavera-catalog-updated", refreshCatalog);
      window.removeEventListener("pageshow", refreshCatalog);
    };
  }, []);

  const getNumericPrice = (price) => Number(String(price).replace(/[^0-9]/g, "")) || 0;

  const addToCart = (product) => {
    updateCart((currentCart) => {
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
    updateCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    updateCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
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

          <Link
            to="/signup"
            className="navbar-button signup-nav-button"
            aria-label="Create your ORGAVERA account"
          >
            <span className="login-nav-copy">
              <small>NEW HERE?</small>
              <strong>SIGN UP</strong>
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

        {/* ================= SHOP BY CATEGORY ================= */}

        <section className="org-category-section" aria-label="Shop by category">
          <div className="org-category-shell">
            <div className="org-category-head">
              <div>
                <p className="org-category-kicker">SHOP BY CATEGORY</p>
                <h2>Choose your <em>ORGAVERA ritual.</em></h2>
              </div>
              <p className="org-category-intro">
                Explore our collections and jump straight to the products,
                ingredients or learning experience you are looking for.
              </p>
            </div>

            <div className="org-category-grid">
              <a href="#hair-care" className="org-category-card">
                <div className="org-category-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path d="M9 26c7-2 12-8 14-18M12 6c5 2 8 6 8 11M8 12c4 1 7 4 9 8" />
                  </svg>
                </div>
                <div className="org-category-copy">
                  <span>01 · HAIR RITUALS</span>
                  <strong>Hair Care</strong>
                  <small>Oil · Shampoo · Conditioner</small>
                </div>
                <b className="org-category-arrow">↗</b>
              </a>

              <a href="#skin-care" className="org-category-card">
                <div className="org-category-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="9" />
                    <path d="M12 14c2-3 6-3 8 0M13 20c2 2 4 2 6 0" />
                  </svg>
                </div>
                <div className="org-category-copy">
                  <span>02 · SKIN RITUALS</span>
                  <strong>Skin Care</strong>
                  <small>Serums · Masks · Daily Care</small>
                </div>
                <b className="org-category-arrow">↗</b>
              </a>

              <a href="#soaps-products" className="org-category-card">
                <div className="org-category-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <rect x="7" y="10" width="18" height="13" rx="5" />
                    <path d="M12 8c1-3 7-3 8 0M11 16h10" />
                  </svg>
                </div>
                <div className="org-category-copy">
                  <span>03 · BOTANICAL CLEANSING</span>
                  <strong>Artisan Soaps</strong>
                  <small>Handcrafted · Herbal · Small Batch</small>
                </div>
                <b className="org-category-arrow">↗</b>
              </a>

              <a href="#ingredients-products" className="org-category-card">
                <div className="org-category-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path d="M12 5v7L7 23c-1 2 1 4 3 4h12c2 0 4-2 3-4l-5-11V5" />
                    <path d="M11 19h10M10 8h12" />
                  </svg>
                </div>
                <div className="org-category-copy">
                  <span>04 · FORMULATION ESSENTIALS</span>
                  <strong>Cosmetic Ingredients</strong>
                  <small>Actives · Bases · Formulation Supplies</small>
                </div>
                <b className="org-category-arrow">↗</b>
              </a>

              <a href="#classes-products" className="org-category-card org-category-card-featured">
                <div className="org-category-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path d="M7 8h8c3 0 5 2 5 5v12h-8c-3 0-5-2-5-5V8Z" />
                    <path d="M25 8h-5v17h5V8ZM11 13h5M11 17h5" />
                  </svg>
                </div>
                <div className="org-category-copy">
                  <span>05 · LEARN WITH ORGAVERA</span>
                  <strong>Book a Class</strong>
                  <small>Hands-on Botanical Formulation Sessions</small>
                </div>
                <b className="org-category-arrow">↗</b>
              </a>
            </div>
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

          <div className="collection-group reveal" id="skin-care">
            <div className="collection-row-heading">
              <div>
                <span>01</span>
                <p>SKIN CARE</p>
              </div>

              <small>{adminCatalog.skincare.length} {adminCatalog.skincare.length === 1 ? "product" : "products"}</small>
            </div>

            <div className="collection-scroll">
              {adminCatalog.skincare.map((product) => (
                <article className="collection-card" key={product.id}>
                  <div className="collection-image-wrap">
                    <img
                      src={normalizePublicImagePath(product.image)}
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
                    {product.description && (
                      <p style={{ marginTop: "12px", marginBottom: "14px", textTransform: "none", letterSpacing: 0, lineHeight: 1.6, opacity: 0.72 }}>
                        {product.description}
                      </p>
                    )}
                    <strong>{product.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="collection-group reveal" id="hair-care">
            <div className="collection-row-heading">
              <div>
                <span>02</span>
                <p>HAIR CARE</p>
              </div>

              <small>{adminCatalog.haircare.length} {adminCatalog.haircare.length === 1 ? "product" : "products"}</small>
            </div>

            <div className="collection-scroll collection-scroll-hair">
              {adminCatalog.haircare.map((product) => (
                <article className="collection-card" key={product.id}>
                  <div className="collection-image-wrap">
                    <img
                      src={normalizePublicImagePath(product.image)}
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
                    {product.description && (
                      <p style={{ marginTop: "12px", marginBottom: "14px", textTransform: "none", letterSpacing: 0, lineHeight: 1.6, opacity: 0.72 }}>
                        {product.description}
                      </p>
                    )}
                    <strong>{product.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ================= ADMIN-MANAGED CATEGORY PRODUCTS ================= */}

          {[
            {
              id: "soaps-products",
              number: "03",
              title: "Artisan Soaps",
              items: adminCatalog.soaps,
            },
            {
              id: "ingredients-products",
              number: "04",
              title: "Cosmetic Ingredients",
              items: adminCatalog.ingredients,
            },
            {
              id: "classes-products",
              number: "05",
              title: "Book a Class",
              items: adminCatalog.classes,
            },
          ].map((category) => (
            <div
              className="collection-group reveal show"
              id={category.id}
              key={category.id}
              style={{ scrollMarginTop: "130px" }}
            >
              <div className="collection-row-heading">
                <div>
                  <span>{category.number}</span>
                  <p>{category.title.toUpperCase()}</p>
                </div>
                <small>
                  {category.items.length} {category.items.length === 1 ? "listing" : "listings"}
                </small>
              </div>

              <div
                className="collection-scroll"
                style={{
                  overflow: "visible",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "22px",
                }}
              >
                {category.items.map((item) => (
                  <article className="collection-card" key={item.id} style={{ minWidth: 0 }}>
                    <div className="collection-image-wrap">
                      <img
                        src={normalizePublicImagePath(item.image)}
                        alt={`${item.name} by ORGAVERA`}
                        className="collection-image"
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/orgavera-logo.png";
                          event.currentTarget.classList.add("collection-image-fallback");
                        }}
                      />

                      {category.id !== "classes-products" && (
                        <button
                          type="button"
                          className="collection-order"
                          aria-label={`Add ${item.name} to cart`}
                          onClick={() => addToCart(item)}
                        >
                          +
                        </button>
                      )}
                    </div>

                    <div className="collection-card-info">
                      <p>{item.type}</p>
                      <h3>{item.name}</h3>
                      {item.description && (
                        <p
                          style={{
                            marginTop: "14px",
                            marginBottom: "16px",
                            textTransform: "none",
                            letterSpacing: "0",
                            lineHeight: "1.7",
                            opacity: 0.72,
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                      <strong>{item.price}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

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


function CategoryCollectionPage({ categoryKey }) {
  const config = categoryPageConfig[categoryKey];

  const loadCatalog = () => {
    try {
      const saved = window.localStorage.getItem("orgaveraAdminCatalog");
      if (!saved) return defaultAdminCatalog;
      const parsed = JSON.parse(saved);

      return {
        skincare: Array.isArray(parsed.skincare) ? parsed.skincare : defaultAdminCatalog.skincare,
        haircare: Array.isArray(parsed.haircare) ? parsed.haircare : defaultAdminCatalog.haircare,
        soaps: Array.isArray(parsed.soaps) ? parsed.soaps : defaultAdminCatalog.soaps,
        ingredients: Array.isArray(parsed.ingredients)
          ? parsed.ingredients
          : defaultAdminCatalog.ingredients,
        classes: Array.isArray(parsed.classes)
          ? parsed.classes
          : defaultAdminCatalog.classes,
      };
    } catch {
      return defaultAdminCatalog;
    }
  };

  const [catalog, setCatalog] = useState(loadCatalog);

  useEffect(() => {
    const refreshCatalog = () => setCatalog(loadCatalog);

    window.addEventListener("storage", refreshCatalog);
    window.addEventListener("orgavera-catalog-updated", refreshCatalog);

    return () => {
      window.removeEventListener("storage", refreshCatalog);
      window.removeEventListener("orgavera-catalog-updated", refreshCatalog);
    };
  }, []);

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const items = catalog[config.storageKey] || [];

  return (
    <div className="website">
      <header className="navbar">
        <Link to="/" className="brand">
          <img src="/orgavera-logo.png" alt="ORGAVERA logo" />
          <div className="brand-name">
            <h2>ORGAVERA</h2>
            <span>Pure · Natural · Organic</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#products">Products</Link>
          <Link to="/#story">Our Story</Link>
          <Link to="/#ingredients">Ingredients</Link>
          <Link to="/#contact">Contact</Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-button login-nav-button">
            Login
            <span>↗</span>
          </Link>
          <Link to="/signup" className="navbar-button signup-nav-button">
            Sign Up
            <span>↗</span>
          </Link>
        </div>
      </header>

      <main>
        <section
          className="products-section"
          style={{
            minHeight: "100vh",
            paddingTop: "150px",
            paddingBottom: "100px",
          }}
        >
          <div className="products-heading reveal show">
            <div>
              <p className="section-label">
                {config.number} / {config.eyebrow}
              </p>

              <h2>
                {config.title.split(" ")[0]}
                <br />
                <em>{config.title.split(" ").slice(1).join(" ")}.</em>
              </h2>
            </div>

            <p>
              Manage these listings from the ORGAVERA admin panel. Product image,
              details and price updates will appear here automatically in this
              browser.
            </p>
          </div>

          <div className="collection-group reveal show">
            <div className="collection-row-heading">
              <div>
                <span>{config.number}</span>
                <p>{config.title.toUpperCase()}</p>
              </div>

              <small>
                {items.length} {items.length === 1 ? "listing" : "listings"}
              </small>
            </div>

            <div
              className="collection-scroll"
              style={{
                overflow: "visible",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "22px",
              }}
            >
              {items.map((item) => (
                <article
                  className="collection-card"
                  key={item.id}
                  style={{ minWidth: 0 }}
                >
                  <div className="collection-image-wrap">
                    <img
                      src={normalizePublicImagePath(item.image)}
                      alt={`${item.name} by ORGAVERA`}
                      className="collection-image"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/orgavera-logo.png";
                        event.currentTarget.classList.add(
                          "collection-image-fallback"
                        );
                      }}
                    />
                  </div>

                  <div className="collection-card-info">
                    <p>{item.type}</p>
                    <h3>{item.name}</h3>

                    {item.description && (
                      <p
                        style={{
                          marginTop: "14px",
                          marginBottom: "16px",
                          textTransform: "none",
                          letterSpacing: "0",
                          lineHeight: "1.7",
                          opacity: 0.72,
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    <strong>{item.price}</strong>

                    <a
                      href="https://wa.me/923709301194"
                      target="_blank"
                      rel="noreferrer"
                      className="text-link"
                      style={{
                        display: "inline-flex",
                        marginTop: "20px",
                      }}
                    >
                      {categoryKey === "classes"
                        ? "Ask / Book on WhatsApp →"
                        : "Ask / Order on WhatsApp →"}
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {!items.length && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "40px",
                  border: "1px solid rgba(210,168,74,.22)",
                  textAlign: "center",
                }}
              >
                <p>No listings are available in this collection yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}



const ADMIN_PASSWORD = "hamna2722";
const ADMIN_SESSION_KEY = "orgaveraAdminAuthorized";

function ProtectedAdmin() {
  const [authorized, setAuthorized] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (event) => {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setAuthorized(true);
      setPassword("");
      setError("");
      return;
    }

    setError("Incorrect admin password.");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthorized(false);
  };

  if (authorized) {
    return (
      <div>
        <button
          type="button"
          onClick={handleAdminLogout}
          style={{
            position: "fixed",
            top: "18px",
            right: "18px",
            zIndex: 9999,
            padding: "10px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(210,168,74,.5)",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Admin Logout
        </button>
        <Admin />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, rgba(161,129,64,.18), transparent 34%), #0c0d0c",
        color: "#fff",
      }}
    >
      <form
        onSubmit={handleAdminLogin}
        style={{
          width: "min(430px, 100%)",
          padding: "38px",
          border: "1px solid rgba(210,168,74,.28)",
          borderRadius: "24px",
          background: "rgba(20,22,20,.96)",
          boxShadow: "0 24px 70px rgba(0,0,0,.35)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img
            src="/orgavera-logo.png"
            alt="ORGAVERA"
            style={{ width: "78px", height: "78px", objectFit: "contain" }}
          />
          <p
            style={{
              margin: "16px 0 6px",
              fontSize: "12px",
              letterSpacing: "3px",
              color: "#d2a84a",
            }}
          >
            AUTHORIZED ACCESS ONLY
          </p>
          <h1 style={{ margin: 0, fontSize: "32px" }}>ORGAVERA Admin</h1>
          <p style={{ margin: "10px 0 0", opacity: 0.65 }}>
            Enter the admin password to manage your catalog.
          </p>
        </div>

        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600 }}>
          Admin Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          placeholder="Enter password"
          autoFocus
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 16px",
            borderRadius: "12px",
            border: error
              ? "1px solid #ff7b7b"
              : "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.06)",
            color: "#fff",
            outline: "none",
            fontSize: "16px",
          }}
        />

        {error && (
          <p style={{ margin: "10px 0 0", color: "#ff9a9a", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            border: 0,
            background: "#d2a84a",
            color: "#111",
            fontWeight: 800,
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Unlock Admin Panel →
        </button>

        <Link
          to="/"
          style={{
            display: "block",
            marginTop: "18px",
            textAlign: "center",
            color: "rgba(255,255,255,.7)",
            textDecoration: "none",
          }}
        >
          ← Back to website
        </Link>
      </form>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<ProtectedAdmin />} />
      <Route
        path="/collection/soaps"
        element={<CategoryCollectionPage categoryKey="soaps" />}
      />
      <Route
        path="/collection/cosmetic-ingredients"
        element={<CategoryCollectionPage categoryKey="ingredients" />}
      />
      <Route
        path="/classes"
        element={<CategoryCollectionPage categoryKey="classes" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;