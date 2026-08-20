


import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
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
  bestsellers: products.map((item) => ({ ...item, type: item.category, description: item.oldPrice || "" })),
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
  skincare: {
    number: "01",
    eyebrow: "BOTANICAL SKIN RITUALS",
    title: "Skin Care",
    storageKey: "skincare",
    intro: "Thoughtful daily care for cleansing, hydration, glow and a beautifully balanced routine.",
    benefitA: "BOTANICAL CARE",
    benefitB: "EVERYDAY RITUAL",
    benefitC: "ORGAVERA QUALITY",
    heroIcon: "✦",
  },
  haircare: {
    number: "02",
    eyebrow: "ROOTED HAIR RITUALS",
    title: "Hair Care",
    storageKey: "haircare",
    intro: "Herbal-inspired essentials made for cleansing, nourishment and a polished everyday hair ritual.",
    benefitA: "HERBAL INSPIRED",
    benefitB: "NOURISHING CARE",
    benefitC: "THOUGHTFULLY MADE",
    heroIcon: "≈",
  },
  soaps: {
    number: "03",
    eyebrow: "HANDCRAFTED CLEANSING",
    title: "Artisan Soaps",
    storageKey: "soaps",
    intro: "Handcrafted botanical cleansing bars designed to turn an everyday wash into a richer self-care ritual.",
    benefitA: "BOTANICAL BLENDS",
    benefitB: "HANDCRAFTED",
    benefitC: "SMALL-BATCH CARE",
    heroIcon: "❧",
  },
  ingredients: {
    number: "04",
    eyebrow: "FORMULATION ESSENTIALS",
    title: "Cosmetic Ingredients",
    storageKey: "ingredients",
    intro: "Selected formulation essentials for makers who value clean organization, clear product information and reliable sourcing.",
    benefitA: "FORMULATION READY",
    benefitB: "CLEAR DETAILS",
    benefitC: "MAKER FOCUSED",
    heroIcon: "⚗",
  },
  classes: {
    number: "05",
    eyebrow: "LEARN WITH ORGAVERA",
    title: "Book a Class",
    storageKey: "classes",
    intro: "Practical learning experiences for skincare, haircare and artisan formulation in a focused, welcoming setting.",
    benefitA: "PRACTICAL LEARNING",
    benefitB: "GUIDED SESSIONS",
    benefitC: "LIMITED SEATS",
    heroIcon: "⌁",
  },
};


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_CATEGORY_KEYS = {
  "best-sellers": "bestsellers",
  "best sellers": "bestsellers",
  bestsellers: "bestsellers",
  "skin-care": "skincare",
  skincare: "skincare",
  "skin care": "skincare",
  "hair-care": "haircare",
  haircare: "haircare",
  "hair care": "haircare",
  soaps: "soaps",
  soap: "soaps",
  ingredients: "ingredients",
  "cosmetic ingredients": "ingredients",
  classes: "classes",
  class: "classes",
};

const buildCatalogFromApi = (apiProducts) => {
  const catalog = { bestsellers: [], skincare: [], haircare: [], soaps: [], ingredients: [], classes: [] };

  (Array.isArray(apiProducts) ? apiProducts : []).forEach((item) => {
    const key = API_CATEGORY_KEYS[String(item.category || "").trim().toLowerCase()];
    if (!key) return;

    catalog[key].push({
      ...item,
      id: item._id || item.id,
      price:
        typeof item.price === "number"
          ? `Rs. ${item.price}`
          : String(item.price || ""),
      image: normalizePublicImagePath(item.image),
      type: item.type || item.category || "",
      description: item.description || "",
    });
  });

  return catalog;
};

const fetchCatalogFromApi = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not load products.");
  }

  return buildCatalogFromApi(result.data);
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

  const updateCart = (updater) => {
    setCart((currentCart) => {
      const nextCart = typeof updater === "function" ? updater(currentCart) : updater;
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
      } catch (error) {
        console.error("Could not save cart:", error);
      }
      return nextCart;
    });
  };

  const getNumericPrice = (price) => Number(String(price).replace(/[^0-9]/g, "")) || 0;

  // Load the live product catalog from the MongoDB-backed API.
  const [adminCatalog, setAdminCatalog] = useState(defaultAdminCatalog);

  const bestSellerDeals = adminCatalog.bestsellers.length
    ? adminCatalog.bestsellers.slice(0, 4).map((item) => {
      const currentPrice = getNumericPrice(item.price);
      const originalPrice = getNumericPrice(item.description);
      const discount =
        originalPrice > currentPrice && currentPrice > 0
          ? `-${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%`
          : "DEAL";

      return {
        ...item,
        category: item.type || "ORGAVERA",
        oldPrice: originalPrice > currentPrice ? `Rs. ${originalPrice.toLocaleString()}` : "",
        discount,
      };
    })
    : products;

  useEffect(() => {
    let active = true;

    const refreshCatalog = async () => {
      try {
        const liveCatalog = await fetchCatalogFromApi();
        if (active) setAdminCatalog(liveCatalog);
      } catch (error) {
        console.error("Could not load MongoDB catalog:", error);
      }
    };

    refreshCatalog();

    return () => {
      active = false;
    };
  }, []);


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

        <section className="home-category-showcase home-category-luxury" id="shop-categories" aria-label="Shop ORGAVERA by category">
          <div className="home-category-shell">
            <div className="home-category-section-head reveal show">
              <p>CURATED ORGAVERA COLLECTIONS</p>
              <div className="home-category-title-row">
                <span></span><h3>Shop by Category</h3><span></span>
              </div>
              <small>Choose a category and explore products made for your routine.</small>
            </div>

            <div className="home-category-grid home-category-grid-five" id="category-grid">
              <Link to="/collection/skin-care" className="home-category-card-premium">
                <div className="home-category-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" /><path d="M9 10h6M12 7v6" /></svg>
                </div>
                <div className="home-category-card-body">
                  <h3>Skin Care</h3>
                  <p>Nourish, protect &amp; glow with our natural skincare.</p>
                  <span className="home-category-card-count">{adminCatalog.skincare.length || "Explore"} products</span>
                  <span className="home-category-card-button">Shop Now <b>→</b></span>
                </div>
              </Link>

              <Link to="/collection/hair-care" className="home-category-card-premium">
                <div className="home-category-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 4c5 0 8 4 8 8 0 4-2 7-5 8" /><path d="M10 4c-2 3-2 6 0 9 1 2 1 4 0 7" /><path d="M6 5c-1 4 0 7 3 9" /></svg>
                </div>
                <div className="home-category-card-body">
                  <h3>Hair Care</h3>
                  <p>Strengthen, repair &amp; refresh with herbal care.</p>
                  <span className="home-category-card-count">{adminCatalog.haircare.length || "Explore"} products</span>
                  <span className="home-category-card-button">Shop Now <b>→</b></span>
                </div>
              </Link>

              <Link to="/collection/soaps" className="home-category-card-premium">
                <div className="home-category-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 15c3-8 8-10 14-10-1 6-4 11-10 12" /><path d="M8 18c3-3 6-6 10-8" /></svg>
                </div>
                <div className="home-category-card-body">
                  <h3>Artisan Soaps</h3>
                  <p>Handcrafted soaps made with pure botanical ingredients.</p>
                  <span className="home-category-card-count">{adminCatalog.soaps.length || "Explore"} products</span>
                  <span className="home-category-card-button">Shop Now <b>→</b></span>
                </div>
              </Link>

              <Link to="/collection/cosmetic-ingredients" className="home-category-card-premium">
                <div className="home-category-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M8 15h8" /></svg>
                </div>
                <div className="home-category-card-body">
                  <h3>Cosmetic Ingredients</h3>
                  <p>High quality ingredients for your formulations.</p>
                  <span className="home-category-card-count">{adminCatalog.ingredients.length || "Explore"} products</span>
                  <span className="home-category-card-button">Shop Now <b>→</b></span>
                </div>
              </Link>

              <Link to="/classes" className="home-category-card-premium">
                <div className="home-category-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="m3 10 9-5 9 5-9 5-9-5Z" /><path d="M7 12v5c3 2 7 2 10 0v-5" /></svg>
                </div>
                <div className="home-category-card-body">
                  <h3>Book a Class</h3>
                  <p>Learn, create &amp; grow with our formulation classes.</p>
                  <span className="home-category-card-count">{adminCatalog.classes.length || "Explore"} classes</span>
                  <span className="home-category-card-button">View Classes <b>→</b></span>
                </div>
              </Link>
            </div>

            <div className="home-category-trust-strip reveal show">
              <div><span>❧</span><p><b>100% Natural</b><small>Pure &amp; Safe</small></p></div>
              <div><span>♨</span><p><b>Handcrafted</b><small>Made with Care</small></p></div>
              <div><span>⚗</span><p><b>Chemical Free</b><small>No Harmful Additives</small></p></div>
              <div><span>♧</span><p><b>Ethical Sourcing</b><small>Responsible &amp; Sustainable</small></p></div>
              <div><span>♡</span><p><b>Cruelty Free</b><small>Not Tested on Animals</small></p></div>
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
            {bestSellerDeals.map((product) => (
              <article className="top-seller-card reveal" key={product.id}>
                <div className="top-seller-image-wrap">
                  <span className="discount-badge">{product.discount}</span>

                  <img
                    src={product.image}
                    alt={`${product.name} by ORGAVERA`}
                    className={`top-seller-image top-seller-image-${product.id}`}
                    loading="lazy"
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
          <div className="products-heading products-heading-premium reveal">
            <div className="products-heading-copy">
              <div className="products-heading-kicker">
                <span className="products-heading-kicker-line"></span>
                <p className="section-label">THE ORGAVERA COLLECTION</p>
              </div>

              <h2>
                Care, curated
                <br />
                <em>for your ritual.</em>
              </h2>

              <p className="products-heading-subcopy">
                Thoughtfully made skincare, haircare and botanical essentials —
                easy to explore, simple to choose and crafted for everyday care.
              </p>

              <div className="products-heading-points" aria-label="ORGAVERA collection highlights">
                <span><b>✦</b> Botanical care</span>
                <span><b>✦</b> Small-batch made</span>
                <span><b>✦</b> Easy WhatsApp ordering</span>
              </div>
            </div>

            <div className="products-heading-side">
              <span className="products-heading-side-label">EXPLORE BY CATEGORY</span>
              <div className="products-heading-category-links">
                <a href="#skin-care">Skin Care <b>↘</b></a>
                <a href="#hair-care">Hair Care <b>↘</b></a>
                <a href="#soaps-products">Soaps <b>↘</b></a>
                <a href="#ingredients-products">Ingredients <b>↘</b></a>
              </div>
              <a href="#skin-care" className="products-heading-explore">
                Start exploring <span>↘</span>
              </a>
            </div>
          </div>

          <div className="collection-group reveal" id="skin-care">
            <div className="collection-row-heading">
              <div>
                <span>01</span>
                <p>SKIN CARE</p>
              </div>

              <Link to="/collection/skin-care" className="collection-row-see-more">
                See More <b>↗</b>
              </Link>
            </div>

            <div className="collection-scroll collection-scroll-preview">
              {adminCatalog.skincare.slice(0, 4).map((product) => (
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

              <Link to="/collection/hair-care" className="collection-row-see-more">
                See More <b>↗</b>
              </Link>
            </div>

            <div className="collection-scroll collection-scroll-hair collection-scroll-preview">
              {adminCatalog.haircare.slice(0, 4).map((product) => (
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
              moreTo: "/collection/soaps",
            },
            {
              id: "ingredients-products",
              number: "04",
              title: "Cosmetic Ingredients",
              items: adminCatalog.ingredients,
              moreTo: "/collection/cosmetic-ingredients",
            },
            {
              id: "classes-products",
              number: "05",
              title: "Book a Class",
              items: adminCatalog.classes,
              moreTo: "/classes",
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
                <Link to={category.moreTo} className="collection-row-see-more">
                  See More <b>↗</b>
                </Link>
              </div>

              <div className="collection-scroll collection-scroll-preview">
                {category.items.slice(0, 4).map((item) => (
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

            <div className="footer-links-group footer-category-links">
              <p>CATEGORIES</p>
              <Link to="/collection/skin-care">Skin Care <span>↗</span></Link>
              <Link to="/collection/hair-care">Hair Care <span>↗</span></Link>
              <Link to="/collection/soaps">Artisan Soaps <span>↗</span></Link>
              <Link to="/collection/cosmetic-ingredients">Cosmetic Ingredients <span>↗</span></Link>
              <Link to="/classes">Book a Class <span>↗</span></Link>
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
  const CART_STORAGE_KEY = "orgaveraCart";
  const [catalog, setCatalog] = useState(defaultAdminCatalog);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [cart, setCart] = useState(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not load saved cart:", error);
      return [];
    }
  });

  const getNumericPrice = (price) => Number(String(price ?? "").replace(/[^0-9.]/g, "")) || 0;

  const updateCart = (updater) => {
    setCart((currentCart) => {
      const nextCart = typeof updater === "function" ? updater(currentCart) : updater;
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
      } catch (error) {
        console.error("Could not save cart:", error);
      }
      return nextCart;
    });
  };

  useEffect(() => {
    let active = true;

    const refreshCatalog = async () => {
      try {
        const liveCatalog = await fetchCatalogFromApi();
        if (active) setCatalog(liveCatalog);
      } catch (error) {
        console.error("Could not load MongoDB category catalog:", error);
      }
    };

    refreshCatalog();
    return () => { active = false; };
  }, []);

  if (!config) return <Navigate to="/" replace />;

  const items = catalog[config.storageKey] || [];
  const filteredItems = items
    .filter((item) => [item.name, item.type, item.description].join(" ").toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => {
      const priceA = getNumericPrice(a.price);
      const priceB = getNumericPrice(b.price);
      if (sortOrder === "price-low") return priceA - priceB;
      if (sortOrder === "price-high") return priceB - priceA;
      if (sortOrder === "name") return String(a.name).localeCompare(String(b.name));
      return 0;
    });

  const getItemVariants = (item) =>
    Array.isArray(item.variants)
      ? item.variants.filter((variant) => String(variant?.label || variant?.size || "").trim())
      : [];

  const getSelectedVariant = (item) => {
    const variants = getItemVariants(item);
    if (!variants.length) return null;
    const selectedLabel = selectedVariants[item.id] || String(variants[0].label || variants[0].size || "");
    return variants.find((variant) => String(variant.label || variant.size || "") === selectedLabel) || variants[0];
  };

  const getDisplayPrice = (item) => {
    const variant = getSelectedVariant(item);
    const numeric = variant ? getNumericPrice(variant.price) : getNumericPrice(item.price);
    if (numeric > 0) return `Rs. ${numeric.toLocaleString()}`;
    return String(item.price || "Ask for price");
  };

  const addCategoryItemToCart = (item) => {
    const variant = getSelectedVariant(item);
    const variantLabel = variant ? String(variant.label || variant.size || "").trim() : "";
    const unitPrice = variant ? getNumericPrice(variant.price) : getNumericPrice(item.price);
    const cartId = variantLabel ? `${item.id}::${variantLabel}` : item.id;
    const priceLabel = unitPrice > 0 ? `Rs. ${unitPrice}` : String(item.price || "Ask for price");

    updateCart((currentCart) => {
      const existing = currentCart.find((cartItem) => cartItem.id === cartId);
      if (existing) {
        return currentCart.map((cartItem) =>
          cartItem.id === cartId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          id: cartId,
          originalId: item.id,
          variantLabel,
          unitPrice,
          price: priceLabel,
          image: normalizePublicImagePath(item.image),
          quantity: 1,
        },
      ];
    });

    setNotice(`${item.name}${variantLabel ? ` (${variantLabel})` : ""} added to cart`);
    setIsCartOpen(true);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const updateQuantity = (id, change) => {
    updateCart((currentCart) =>
      currentCart
        .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    updateCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const cartTotal = cart.reduce((total, item) => {
    const unit = Number(item.unitPrice || getNumericPrice(item.price));
    return total + unit * Number(item.quantity || 0);
  }, 0);
  const hasUnpricedItems = cart.some((item) => Number(item.unitPrice || getNumericPrice(item.price)) <= 0);

  const placeCategoryCartOrder = (number = "923709301194") => {
    if (!cart.length) {
      setNotice("Your cart is empty");
      window.setTimeout(() => setNotice(""), 2200);
      return;
    }

    const productLines = cart.map((item, index) => {
      const unit = Number(item.unitPrice || getNumericPrice(item.price));
      const qty = Number(item.quantity || 1);
      const variant = item.variantLabel ? ` — ${item.variantLabel}` : "";
      const priceText = unit > 0
        ? `Rs. ${unit.toLocaleString()} × ${qty} = Rs. ${(unit * qty).toLocaleString()}`
        : `Price to be confirmed × ${qty}`;
      return `${index + 1}. ${item.name}${variant}\n   ${priceText}`;
    }).join("\n\n");

    const customerLines = [
      customer.name.trim() ? `Customer: ${customer.name.trim()}` : "",
      customer.phone.trim() ? `Phone: ${customer.phone.trim()}` : "",
      customer.address.trim() ? `Address: ${customer.address.trim()}` : "",
    ].filter(Boolean).join("\n");

    const totalLine = cartTotal > 0 ? `Known Total: Rs. ${cartTotal.toLocaleString()}` : "Total: Please confirm prices";
    const priceNote = hasUnpricedItems ? "\nNote: One or more item prices need confirmation." : "";
    const message = `🌿 ORGAVERA ORDER\n\n${customerLines ? `${customerLines}\n\n` : ""}ORDER ITEMS\n${productLines}\n\n${totalLine}${priceNote}\n\nPlease confirm availability, delivery charges and final order total.`;

    const encoded = encodeURIComponent(message);
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const url = mobile
      ? `https://wa.me/${number}?text=${encoded}`
      : `https://web.whatsapp.com/send?phone=${number}&text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="website premium-collection-page">
      <header className="navbar premium-collection-nav">
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

        <button type="button" className="navbar-button cart-nav-button category-page-cart-button" onClick={() => setIsCartOpen(true)}>
          Cart <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <main className="premium-collection-main">
        <section className="premium-catalog-section premium-catalog-first" id="collection-products">
          <div className="premium-catalog-toolbar">
            <div className="premium-catalog-title premium-catalog-title-featured">
              <span className="premium-title-spark">✦</span>
              <div>
                <small>ORGAVERA · {config.number}</small>
                <h1>{config.title}</h1>
                <p>{config.intro}</p>
              </div>
            </div>

            <div className="premium-catalog-controls">
              <label className="premium-search-box">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  aria-label={`Search ${config.title}`}
                />
              </label>
              <span className="premium-listing-count">{filteredItems.length} {filteredItems.length === 1 ? "listing" : "listings"}</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="name">Name A–Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="premium-product-grid">
            {filteredItems.map((item, index) => {
              const variants = getItemVariants(item);
              const selectedVariant = getSelectedVariant(item);
              const selectedLabel = selectedVariant ? String(selectedVariant.label || selectedVariant.size || "") : "";

              return (
                <article className="premium-product-card" key={item.id}>
                  <div className="premium-product-image-wrap">
                    <span className="premium-product-badge">{index === 0 ? "FEATURED" : "ORGAVERA"}</span>
                    <img
                      src={normalizePublicImagePath(item.image)}
                      alt={`${item.name} by ORGAVERA`}
                      className="premium-product-image"
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
                      className="premium-card-action"
                      aria-label={`Add ${item.name} to cart`}
                      onClick={() => addCategoryItemToCart(item)}
                    >
                      +
                    </button>
                  </div>

                  <div className="premium-product-info">
                    <p>{item.type || "ORGAVERA"}</p>
                    <h3>{item.name}</h3>
                    {item.description && <span className="premium-product-description">{item.description}</span>}

                    {variants.length > 0 && (
                      <label className="premium-variant-picker">
                        <span>Select size</span>
                        <select
                          value={selectedLabel}
                          onChange={(event) => setSelectedVariants((current) => ({ ...current, [item.id]: event.target.value }))}
                        >
                          {variants.map((variant) => {
                            const label = String(variant.label || variant.size || "");
                            const price = getNumericPrice(variant.price);
                            return <option key={label} value={label}>{label}{price > 0 ? ` — Rs. ${price.toLocaleString()}` : ""}</option>;
                          })}
                        </select>
                      </label>
                    )}

                    <div className="premium-product-bottom">
                      <strong>{getDisplayPrice(item)}</strong>
                      <button type="button" className="premium-add-to-cart-button" onClick={() => addCategoryItemToCart(item)}>
                        {categoryKey === "classes" ? "Add Booking" : "Add to Cart"} →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!filteredItems.length && (
            <div className="premium-empty-state">
              <img src="/orgavera-logo.png" alt="ORGAVERA" />
              <h3>{query ? "No matching products" : "Collection coming soon"}</h3>
              <p>{query ? "Try another search term." : "New ORGAVERA listings will appear here as soon as they are added from the admin panel."}</p>
            </div>
          )}
        </section>

        <section className="premium-collection-cta">
          <p>NEED HELP CHOOSING?</p>
          <h2>Talk to ORGAVERA <em>directly.</em></h2>
          <a href="https://wa.me/923709301194" target="_blank" rel="noreferrer">Chat on WhatsApp ↗</a>
        </section>
      </main>

      {notice && <div className="cart-notice" role="status">{notice}</div>}
      <div className={`cart-backdrop ${isCartOpen ? "show" : ""}`} onClick={() => setIsCartOpen(false)} aria-hidden={!isCartOpen}></div>

      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <div className="cart-title-wrap">
            <span>YOUR ORGAVERA BAG</span>
            <h3>Order Summary</h3>
            <p>{cartCount} {cartCount === 1 ? "product" : "products"} selected</p>
          </div>
          <button type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">×</button>
        </div>

        <div className="cart-drawer-body premium-step-body">
          {!cart.length ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">❧</div>
              <h4>Your cart is empty</h4>
              <p>Select products first. Your complete price list will appear here automatically.</p>
              <button type="button" onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            <section className="checkout-step checkout-review-step">
              <div className="cart-section-title large-summary-title">
                <div><span>01</span><h4>Selected Products</h4></div>
                <small>{cartCount} {cartCount === 1 ? "item" : "items"}</small>
              </div>

              <div className="cart-items expanded-cart-items">
                {cart.map((item) => {
                  const unit = Number(item.unitPrice || getNumericPrice(item.price));
                  return (
                    <article className="cart-item premium-cart-item" key={item.id}>
                      <div className="cart-item-image-wrap"><img src={normalizePublicImagePath(item.image)} alt={item.name} /></div>
                      <div className="cart-item-copy">
                        <small>{item.variantLabel || item.category || item.type || "ORGAVERA"}</small>
                        <h4>{item.name}</h4>
                        <p>{unit > 0 ? `Rs. ${unit.toLocaleString()} each` : "Price to be confirmed"}</p>
                        <div className="cart-quantity" aria-label={`Quantity of ${item.name}`}>
                          <button type="button" onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                      <strong className="cart-line-total">{unit > 0 ? `Rs. ${(unit * item.quantity).toLocaleString()}` : "Ask price"}</strong>
                      <button type="button" className="cart-remove" onClick={() => removeFromCart(item.id)}>×</button>
                    </article>
                  );
                })}
              </div>

              <div className="review-total-card category-cart-total-card">
                <div><span>Known subtotal</span><b>Rs. {cartTotal.toLocaleString()}</b></div>
                {hasUnpricedItems && <div><span>Unpriced items</span><b>Confirm on WhatsApp</b></div>}
                <div><span>Delivery charges</span><b>Confirmed on WhatsApp</b></div>
                <div className="review-grand-total"><span>Price List Total</span><strong>Rs. {cartTotal.toLocaleString()}</strong></div>
              </div>

              <div className="checkout-form premium-checkout-form category-quick-checkout">
                <label className="checkout-field"><span className="checkout-field-icon">♙</span><div><small>Name (optional)</small><input type="text" placeholder="Customer name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></div></label>
                <label className="checkout-field"><span className="checkout-field-icon">☎</span><div><small>Phone (optional)</small><input type="tel" placeholder="03XX XXXXXXX" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></div></label>
                <label className="checkout-field checkout-address-field"><span className="checkout-field-icon">⌖</span><div><small>Address (optional)</small><textarea placeholder="House, street, area and city" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })}></textarea></div></label>
              </div>

              <button type="button" className="checkout-next-button category-direct-order-button" onClick={() => placeCategoryCartOrder("923709301194")}>
                Place Complete Order on WhatsApp <span>→</span>
              </button>
              <p className="whatsapp-order-note category-order-note">Your selected products, quantities and full price list will be inserted into the WhatsApp message automatically.</p>
            </section>
          )}
        </div>
      </aside>

      <footer className="premium-category-footer">
        <Link to="/" className="premium-footer-brand">
          <img src="/orgavera-logo.png" alt="ORGAVERA" />
          <div><strong>ORGAVERA</strong><span>Pure · Natural · Organic</span></div>
        </Link>
        <span>BOTANICAL BEAUTY · THOUGHTFULLY MADE</span>
        <span>RAWALPINDI · PAKISTAN</span>
      </footer>
    </div>
  );
}


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route
          path="/collection/skin-care"
          element={<CategoryCollectionPage categoryKey="skincare" />}
        />
        <Route
          path="/collection/hair-care"
          element={<CategoryCollectionPage categoryKey="haircare" />}
        />
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
    </>
  );
}

export default App;