import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const STORAGE_KEY = "orgaveraAdminCatalog";

const starterCatalog = {
    skincare: [
        {
            id: "skin-1",
            name: "Brightening Serum",
            type: "Serum",
            price: "Rs. 850",
            image: "/serum.png",
            description: "A lightweight brightening serum for a simple everyday skincare routine.",
        },
        {
            id: "skin-2",
            name: "Sunblock",
            type: "Sun Care",
            price: "Rs. 750",
            image: "/glow-mask.png",
            description: "Daily sun-care protection designed for a comfortable skincare routine.",
        },
        {
            id: "skin-3",
            name: "Herbal Face Wash",
            type: "Cleanser",
            price: "Rs. 650",
            image: "/face wash.png",
            description: "A gentle herbal cleanser for fresh, clean-feeling skin.",
        },
        {
            id: "skin-4",
            name: "Glow Mask",
            type: "Face Mask",
            price: "Rs. 800",
            image: "/glow mask.png",
            description: "A botanical-inspired mask created for a refreshed and cared-for look.",
        },
        {
            id: "skin-5",
            name: "Night Repair Cream",
            type: "Night Care",
            price: "Rs. 900",
            image: "/night cream.png",
            description: "A rich night-care cream for a soft and nourished skin feel.",
        },
    ],
    haircare: [
        {
            id: "hair-1",
            name: "Herbal Hair Oil",
            type: "Hair Oil",
            price: "Rs. 700",
            image: "/hair-oil.png",
            description: "A botanical hair oil for a nourishing traditional hair-care ritual.",
        },
        {
            id: "hair-2",
            name: "Herbal Shampoo",
            type: "Shampoo",
            price: "Rs. 600",
            image: "/shampoo.png",
            description: "A herbal shampoo created for gentle everyday cleansing and care.",
        },
        {
            id: "hair-3",
            name: "Herbal Conditioner",
            type: "Conditioner",
            price: "Rs. 700",
            image: "/conditioner.png",
            description: "A conditioning formula designed to leave hair feeling softer and smoother.",
        },
    ],
    soaps: [
        {
            id: "soap-1",
            name: "Loofah Honey Soap",
            type: "Handcrafted Soap",
            price: "Rs. 450",
            image: "/soap-loofah-honey.png",
            description: "A handcrafted cleansing bar with a botanical, everyday-care feel.",
        },
        {
            id: "soap-2",
            name: "Turmeric Soap",
            type: "Botanical Soap",
            price: "Rs. 400",
            image: "/soap-turmeric.png",
            description: "A small-batch botanical soap created for a simple cleansing ritual.",
        },
    ],
    ingredients: [
        {
            id: "ingredient-1",
            name: "Niacinamide",
            type: "Skincare Active",
            price: "Ask for price",
            image: "/niacinamide.png",
            description: "A cosmetic-grade active for balanced skincare formulations.",
        },
        {
            id: "ingredient-2",
            name: "Alpha Arbutin",
            type: "Skincare Active",
            price: "Ask for price",
            image: "/alpha-arbutin.png",
            description: "A formulation ingredient for selected skincare products.",
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
    ],
};

const loadCatalog = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return starterCatalog;
        const parsed = JSON.parse(saved);
        return {
            skincare: Array.isArray(parsed.skincare) ? parsed.skincare : starterCatalog.skincare,
            haircare: Array.isArray(parsed.haircare) ? parsed.haircare : starterCatalog.haircare,
            soaps: Array.isArray(parsed.soaps) ? parsed.soaps : starterCatalog.soaps,
            ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : starterCatalog.ingredients,
            classes: Array.isArray(parsed.classes) ? parsed.classes : starterCatalog.classes,
        };
    } catch {
        return starterCatalog;
    }
};


const normalizePublicImagePath = (value) => {
    const image = String(value || "").trim().replace(/\\/g, "/");

    if (!image) return "/orgavera-logo.png";
    if (/^(https?:|data:|blob:)/i.test(image)) return image;

    // Vite public-folder images should always start with /.
    return image.startsWith("/") ? image : `/${image.replace(/^\.\//, "")}`;
};

const emptyForm = {
    name: "",
    type: "",
    price: "",
    image: "",
    description: "",
};

export default function Admin() {
    const [catalog, setCatalog] = useState(loadCatalog);
    const [category, setCategory] = useState("skincare");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");

    const items = catalog[category] || [];

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) =>
            [item.name, item.type, item.price, item.description]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [items, search]);

    const saveCatalog = (nextCatalog, message) => {
        setCatalog(nextCatalog);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCatalog));
        window.dispatchEvent(new Event("orgavera-catalog-updated"));
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2200);
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.name.trim() || !form.type.trim() || !form.price.trim()) {
            setNotice("Name, type and price are required.");
            window.setTimeout(() => setNotice(""), 2200);
            return;
        }

        const normalized = {
            ...form,
            image: normalizePublicImagePath(form.image),
            description: form.description.trim(),
        };

        let nextItems;

        if (editingId) {
            nextItems = items.map((item) =>
                item.id === editingId ? { ...item, ...normalized } : item
            );
        } else {
            nextItems = [
                ...items,
                {
                    ...normalized,
                    id: `${category}-${Date.now()}`,
                },
            ];
        }

        const nextCatalog = { ...catalog, [category]: nextItems };
        saveCatalog(
            nextCatalog,
            editingId ? "Listing updated successfully." : "New listing added successfully."
        );
        resetForm();
    };

    const editItem = (item) => {
        setEditingId(item.id);
        setForm({
            name: item.name || "",
            type: item.type || "",
            price: item.price || "",
            image: item.image || "",
            description: item.description || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteItem = (id) => {
        if (!window.confirm("Delete this listing?")) return;
        const nextCatalog = {
            ...catalog,
            [category]: items.filter((item) => item.id !== id),
        };
        saveCatalog(nextCatalog, "Listing deleted.");
        if (editingId === id) resetForm();
    };

    const changeCategory = (nextCategory) => {
        setCategory(nextCategory);
        resetForm();
        setSearch("");
    };

    return (
        <div className="org-admin-page">
            <aside className="org-admin-sidebar">
                <Link to="/" className="org-admin-brand">
                    <img src="/orgavera-logo.png" alt="ORGAVERA" />
                    <div>
                        <strong>ORGAVERA</strong>
                        <span>ADMIN STUDIO</span>
                    </div>
                </Link>

                <p className="org-admin-menu-label">CATALOG</p>

                <button
                    className={category === "skincare" ? "active" : ""}
                    onClick={() => changeCategory("skincare")}
                >
                    <span>01</span>
                    Skin Care
                </button>

                <button
                    className={category === "haircare" ? "active" : ""}
                    onClick={() => changeCategory("haircare")}
                >
                    <span>02</span>
                    Hair Care
                </button>

                <button
                    className={category === "soaps" ? "active" : ""}
                    onClick={() => changeCategory("soaps")}
                >
                    <span>03</span>
                    Artisan Soaps
                </button>

                <button
                    className={category === "ingredients" ? "active" : ""}
                    onClick={() => changeCategory("ingredients")}
                >
                    <span>04</span>
                    Cosmetic Ingredients
                </button>

                <button
                    className={category === "classes" ? "active" : ""}
                    onClick={() => changeCategory("classes")}
                >
                    <span>05</span>
                    Classes
                </button>

                <div className="org-admin-sidebar-bottom">
                    <Link to="/">← View Website</Link>
                    <small>ORGAVERA · Catalog Manager</small>
                </div>
            </aside>

            <main className="org-admin-main">
                <header className="org-admin-topbar">
                    <div>
                        <p>CONTENT MANAGEMENT</p>
                        <h1>
                            Manage <em>{
                                category === "skincare"
                                    ? "Skin Care"
                                    : category === "haircare"
                                        ? "Hair Care"
                                        : category === "ingredients"
                                            ? "Ingredients"
                                            : category === "classes"
                                                ? "Classes"
                                                : "Soaps"
                            }</em>
                        </h1>
                    </div>
                    <Link to="/" className="org-admin-view-site">View live site ↗</Link>
                </header>

                {notice && <div className="org-admin-notice">{notice}</div>}

                <section className="org-admin-form-card">
                    <div className="org-admin-section-heading">
                        <div>
                            <span>{editingId ? "EDIT LISTING" : "ADD NEW LISTING"}</span>
                            <h2>{editingId ? "Update product details" : "Create a new catalog item"}</h2>
                        </div>
                        {editingId && (
                            <button type="button" className="org-admin-cancel" onClick={resetForm}>
                                Cancel edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="org-admin-form">
                        <label>
                            <span>Product / class name *</span>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Neem Soap"
                            />
                        </label>

                        <label>
                            <span>Type / category *</span>
                            <input
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                placeholder="e.g. Herbal Soap"
                            />
                        </label>

                        <label>
                            <span>Price *</span>
                            <input
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="e.g. Rs. 450"
                            />
                        </label>

                        <label className="org-admin-image-field">
                            <span>Image path</span>
                            <input
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                placeholder="/my-product.png"
                            />
                            <small>
                                Image ko <b>frontend/public</b> folder mein rakho, phir yahan
                                <b> /image-name.png</b> likho.
                            </small>
                        </label>

                        <label className="org-admin-description-field">
                            <span>Details / description</span>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Short product details..."
                            />
                        </label>

                        <div className="org-admin-preview">
                            <span>IMAGE PREVIEW</span>
                            <div>
                                <img
                                    src={normalizePublicImagePath(form.image)}
                                    alt="Preview"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/orgavera-logo.png";
                                    }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="org-admin-save">
                            {editingId ? "Update Listing" : "Add Listing"}
                            <span>→</span>
                        </button>
                    </form>
                </section>

                <section className="org-admin-list-section">
                    <div className="org-admin-list-head">
                        <div>
                            <span>LIVE CATALOG</span>
                            <h2>{items.length} listings</h2>
                        </div>

                        <input
                            className="org-admin-search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search listings..."
                        />
                    </div>

                    <div className="org-admin-table-wrap">
                        <table className="org-admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Details</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="org-admin-product-cell">
                                                <img
                                                    src={item.image || "/orgavera-logo.png"}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = "/orgavera-logo.png";
                                                    }}
                                                />
                                                <div>
                                                    <strong>{item.name}</strong>
                                                    <small>{item.image}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.type}</td>
                                        <td><b className="org-admin-price">{item.price}</b></td>
                                        <td className="org-admin-details-cell">{item.description || "—"}</td>
                                        <td>
                                            <div className="org-admin-actions">
                                                <button onClick={() => editItem(item)}>Edit</button>
                                                <button className="danger" onClick={() => deleteItem(item.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!filteredItems.length && (
                                    <tr>
                                        <td colSpan="5" className="org-admin-empty">
                                            No listings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}