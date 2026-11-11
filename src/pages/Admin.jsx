import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCurrentUser } from "../services/authService";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productsService";

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  rating: "0",
  stock_quantity: "",
  category: "",
  images: "",
};

const Admin = () => {
  const user = getCurrentUser();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getProducts({ page: 1, limit: 100 });
      setProducts(data.items);
    } catch (err) {
      setLoadError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header/>
        <main className="flex-1">
          <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 lg:px-8 py-8">
            <div className="w-full max-w-md text-center">
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-2xl font-bold">Access denied</h1>
                <p className="mb-6 text-sm text-gray-600">This area requires an admin account.</p>
                <Link
                  to="/"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Back to Catalog
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      title: product.name,
      description: product.description ?? "",
      price: String(product.price),
      rating: String(product.rating),
      stock_quantity: String(product.stock_quantity ?? 0),
      category: product.category ?? "",
      images: (product.images ?? []).join("\n"),
    });
    setEditingId(product.id);
    setFormError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? It will be hidden from the catalog.`)) {
      return;
    }
    setActionError("");
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      setActionError(err.message || "Failed to delete the product");
    }
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    // Client-side checks mirror the API DTO before wasting a request.
    const images = form.images.split("\n").map((line) => line.trim()).filter(Boolean);
    if (form.title.trim().length < 3) {
      setFormError("Title must be at least 3 characters");
      return;
    }
    if (form.description.trim().length < 10) {
      setFormError("Description must be at least 10 characters");
      return;
    }
    if (images.length < 3) {
      setFormError("At least 3 image URLs are required (one per line)");
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a non-negative number");
      return;
    }
    const rating = form.rating === "" ? 0 : Number(form.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setFormError("Rating must be between 0 and 5");
      return;
    }
    const stock = Number(form.stock_quantity);
    if (!Number.isInteger(stock) || stock < 0) {
      setFormError("Stock quantity must be a non-negative integer");
      return;
    }

    const dto = {
      title: form.title.trim(),
      description: form.description.trim(),
      price,
      rating,
      images,
      stock_quantity: stock,
      category: form.category.trim() || undefined,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, dto);
      } else {
        await createProduct(dto);
      }
      setShowForm(false);
      await loadProducts();
    } catch (err) {
      setFormError(err.message || "Failed to save the product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-medium">Product Management</h1>
                <p className="text-gray-600">Create, update and remove catalog products</p>
              </div>
              {!showForm && (
                <button
                  onClick={openCreate}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Add Product
                </button>
              )}
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-lg">{editingId ? "Edit Product" : "New Product"}</h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="mb-2 block text-sm font-semibold">Title</label>
                    <input
                      id="title"
                      type="text"
                      required
                      className={inputClass}
                      value={form.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="mb-2 block text-sm font-semibold">Description</label>
                    <textarea
                      id="description"
                      required
                      rows={3}
                      className={inputClass}
                      value={form.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="mb-2 block text-sm font-semibold">Price ($)</label>
                    <input
                      id="price"
                      type="number"
                      required
                      min={0}
                      step={0.01}
                      className={inputClass}
                      value={form.price}
                      onChange={(e) => handleFormChange("price", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="rating" className="mb-2 block text-sm font-semibold">Rating (0–5)</label>
                    <input
                      id="rating"
                      type="number"
                      required
                      min={0}
                      max={5}
                      step={0.1}
                      className={inputClass}
                      value={form.rating}
                      onChange={(e) => handleFormChange("rating", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="mb-2 block text-sm font-semibold">Stock Quantity</label>
                    <input
                      id="stock"
                      type="number"
                      required
                      min={0}
                      step={1}
                      className={inputClass}
                      value={form.stock_quantity}
                      onChange={(e) => handleFormChange("stock_quantity", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="mb-2 block text-sm font-semibold">Category</label>
                    <input
                      id="category"
                      type="text"
                      placeholder="e.g. Laptops"
                      className={inputClass}
                      value={form.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="images" className="mb-2 block text-sm font-semibold">
                      Image URLs <span className="font-normal text-gray-500">(one per line, minimum 3)</span>
                    </label>
                    <textarea
                      id="images"
                      required
                      rows={4}
                      placeholder="https://...\nhttps://...\nhttps://..."
                      className={`${inputClass} font-mono text-xs`}
                      value={form.images}
                      onChange={(e) => handleFormChange("images", e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
                </button>
              </form>
            )}

            {actionError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {actionError}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : loadError ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <p className="mb-4 text-red-600">{loadError}</p>
                <button
                  onClick={loadProducts}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                            <Link to={`/product/${product.id}`} className="font-medium hover:text-blue-600 transition-colors">
                              {product.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{product.category ?? "—"}</td>
                        <td className="px-4 py-3 font-semibold text-blue-600">${product.price}</td>
                        <td className="px-4 py-3 text-gray-600">{product.stock_quantity}</td>
                        <td className="px-4 py-3 text-gray-600">{product.rating}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openEdit(product)}
                            className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="ml-4 font-medium text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default Admin;
