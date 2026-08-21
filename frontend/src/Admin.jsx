import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY_MAP = { skincare: "skin-care", haircare: "hair-care", soaps: "soaps", ingredients: "ingredients", classes: "classes" };
const CATEGORY_ALIASES = {
    skincare: ["skin-care", "skincare", "skin care"], haircare: ["hair-care", "haircare", "hair care"],
    soaps: ["soaps", "soap", "artisan soaps"], ingredients: ["ingredients", "cosmetic ingredients"],
    classes: ["classes", "class", "book class"]
};
const norm = v => String(v || "").trim().toLowerCase();
const normalizePublicImagePath = value => {
    const image = String(value || "").trim().replace(/\\/g, "/");
    if (!image) return "/orgavera-logo.png";
    if (/^(https?:|data:|blob:)/i.test(image)) return image;
    return image.startsWith("/") ? image : `/${image.replace(/^\.\//, "")}`;
};
const emptyVariant = { size: "", price: "", stock: "" };
const emptyForm = {
    name: "",
    type: "",
    price: "",
    image: "",
    description: "",
    variants: [],
};

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("skincare");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const flash = m => { setNotice(m); setTimeout(() => setNotice(""), 2600) };
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/products`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Unable to load products");
            setProducts(Array.isArray(json.data) ? json.data : []);
        } catch (e) { flash(e.message) } finally { setLoading(false) }
    };
    useEffect(() => { fetchProducts() }, []);

    const items = useMemo(() => products.filter(p => (CATEGORY_ALIASES[category] || []).includes(norm(p.category))), [products, category]);
    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? items.filter(i => [i.name, i.type, i.price, i.description].join(" ").toLowerCase().includes(q)) : items;
    }, [items, search]);

    const resetForm = () => {
        setForm({ ...emptyForm, variants: [] });
        setEditingId(null);
    };

    const addVariant = () => {
        setForm((current) => ({
            ...current,
            variants: [...(current.variants || []), { ...emptyVariant }],
        }));
    };

    const updateVariant = (index, field, value) => {
        setForm((current) => ({
            ...current,
            variants: (current.variants || []).map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            ),
        }));
    };

    const removeVariant = (index) => {
        setForm((current) => ({
            ...current,
            variants: (current.variants || []).filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.name.trim() || !form.type.trim()) {
            flash("Name and type are required.");
            return;
        }

        const cleanVariants = (form.variants || [])
            .filter((variant) => String(variant.size || "").trim())
            .map((variant) => ({
                size: String(variant.size).trim(),
                price: Number(String(variant.price).replace(/[^0-9.]/g, "")) || 0,
                stock: Number(String(variant.stock).replace(/[^0-9]/g, "")) || 0,
            }));

        const basePrice = cleanVariants.length
            ? cleanVariants[0].price
            : Number(String(form.price).replace(/[^0-9.]/g, ""));

        if (!Number.isFinite(basePrice) || basePrice <= 0) {
            flash("Enter a valid price or add at least one size/price.");
            return;
        }

        const payload = {
            name: form.name.trim(),
            category: CATEGORY_MAP[category],
            type: form.type.trim(),
            price: basePrice,
            image: normalizePublicImagePath(form.image),
            description: form.description.trim(),
            variants: cleanVariants,
        };
        try {
            setSaving(true);
            const res = await fetch(editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`, {
                method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Could not save product");
            flash(editingId ? "Listing updated in MongoDB." : "Listing saved to MongoDB.");
            resetForm(); await fetchProducts();
        } catch (e) { flash(e.message) } finally { setSaving(false) }
    };

    const editItem = item => {
        setEditingId(item._id);
        setForm({
            name: item.name || "",
            type: item.type || "",
            price: item.price ?? "",
            image: item.image || "",
            description: item.description || "",
            variants: Array.isArray(item.variants)
                ? item.variants.map((variant) => ({
                    size: variant.size || variant.label || "",
                    price: variant.price ?? "",
                    stock: variant.stock ?? 0,
                }))
                : [],
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteItem = async id => {
        if (!window.confirm("Delete this listing from MongoDB?")) return;
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Could not delete product");
            flash("Listing deleted from MongoDB."); if (editingId === id) resetForm(); await fetchProducts();
        } catch (e) { flash(e.message) }
    };

    const changeCategory = nextCategory => { setCategory(nextCategory); resetForm(); setSearch("") };

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

                        <div className="org-admin-variants-field">
                            <div className="org-admin-variants-heading">
                                <div>
                                    <span>SIZE / QUANTITY OPTIONS</span>
                                    <small>
                                        Add different sizes with their own price and stock, e.g. 100 ml, 150 ml, 200 ml.
                                    </small>
                                </div>
                                <button type="button" className="org-admin-add-variant" onClick={addVariant}>
                                    + Add Size
                                </button>
                            </div>

                            {(form.variants || []).map((variant, index) => (
                                <div className="org-admin-variant-row" key={index}>
                                    <label>
                                        <span>Size / Quantity</span>
                                        <input
                                            value={variant.size}
                                            onChange={(e) => updateVariant(index, "size", e.target.value)}
                                            placeholder="100 ml"
                                        />
                                    </label>

                                    <label>
                                        <span>Price</span>
                                        <input
                                            value={variant.price}
                                            onChange={(e) => updateVariant(index, "price", e.target.value)}
                                            placeholder="700"
                                            inputMode="decimal"
                                        />
                                    </label>

                                    <label>
                                        <span>Stock</span>
                                        <input
                                            value={variant.stock}
                                            onChange={(e) => updateVariant(index, "stock", e.target.value)}
                                            placeholder="15"
                                            inputMode="numeric"
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        className="org-admin-remove-variant"
                                        onClick={() => removeVariant(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            {(form.variants || []).length > 0 && (
                                <small className="org-admin-variant-note">
                                    The first size price will also be used as the product's starting price.
                                </small>
                            )}
                        </div>

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

                        <button type="submit" className="org-admin-save" disabled={saving}>
                            {saving ? "Saving..." : editingId ? "Update Listing" : "Add Listing"}
                            <span>→</span>
                        </button>
                    </form>
                </section>

                <section className="org-admin-list-section">
                    <div className="org-admin-list-head">
                        <div>
                            <span>LIVE CATALOG</span>
                            <h2>{loading ? "Loading..." : `${items.length} listings`}</h2>
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
                                    <tr key={item._id}>
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
                                        <td>
                                            <b className="org-admin-price">Rs. {item.price}</b>
                                            {Array.isArray(item.variants) && item.variants.length > 0 && (
                                                <div className="org-admin-table-variants">
                                                    {item.variants.map((variant, index) => (
                                                        <small key={index}>
                                                            {variant.size || variant.label}: Rs. {variant.price} · Stock {variant.stock ?? 0}
                                                        </small>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="org-admin-details-cell">{item.description || "—"}</td>
                                        <td>
                                            <div className="org-admin-actions">
                                                <button onClick={() => editItem(item)}>Edit</button>
                                                <button className="danger" onClick={() => deleteItem(item._id)}>
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