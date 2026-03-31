"use client";
// components/admin/AdminProductsClient.tsx
import { useState } from "react";
import { Product, Category } from "@/types";
import { Plus, Edit, Trash2, Search, Package, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  products: Product[];
  categories: Category[];
}

export default function AdminProductsClient({ products: initialProducts, categories }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
    images: [""],
    sizes: "2T,3T,4T,5T,6",
    colors: "Pink,Blue,White",
    isActive: true,
    isFeatured: false,
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      categoryId: categories[0]?.id || "",
      description: "",
      images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500"],
      sizes: "2T,3T,4T,5T,6",
      colors: "Pink,Blue,White",
      isActive: true,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId,
      description: product.description || "",
      images: product.images.length > 0 ? product.images : [""],
      sizes: product.sizes.join(","),
      colors: product.colors.join(","),
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: form.categoryId,
        description: form.description,
        images: form.images.filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
        tags: [],
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      };

      const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      const saved = await res.json();

      if (editing) {
        setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        toast.success("Product updated!");
      } else {
        setProducts((prev) => [saved, ...prev]);
        toast.success("Product created!");
      }
      setShowModal(false);
      router.refresh();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">{products.length} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl hover:shadow-md transition-all"
          style={{ backgroundColor: "#FF6B6B" }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-coral"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3.5 font-bold text-gray-600">Product</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600">Price</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600 hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600 hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      />
                      <span className="font-semibold text-gray-900 line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-gray-600">{product.category?.name}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className={`font-semibold ${product.stock < 10 ? "text-red-500" : "text-gray-700"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl mb-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-playfair font-bold text-xl text-gray-900">
                {editing ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-gray-700 block mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    required
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-field"
                    required
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Stock *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input-field"
                    required
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="input-field"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Image URL</label>
                  <input
                    value={form.images[0]}
                    onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Sizes (comma-separated)</label>
                  <input
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    className="input-field"
                    placeholder="2T,3T,4T,5T,6"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Colors (comma-separated)</label>
                  <input
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className="input-field"
                    placeholder="Pink,Blue,White"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-gray-700 block mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-none h-20"
                    placeholder="Product description..."
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 accent-coral"
                    />
                    <span className="text-sm font-semibold text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-coral"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 text-white font-bold rounded-2xl hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>{editing ? "Update" : "Create"} Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
