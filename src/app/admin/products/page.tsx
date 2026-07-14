"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Product, Category, Material } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Package,
  Image as ImageIcon,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    material_id: "",
    metadata: "",
    image: "",
  });

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsList, catsList, matsList] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getMaterials()
      ]);
      setProducts(prodsList);
      setCategories(catsList);
      setMaterials(matsList);

      // Pre-fill categories/materials default options in form
      if (catsList.length > 0 && !formData.category_id) {
        setFormData(prev => ({
          ...prev,
          category_id: prev.category_id || catsList[0].id
        }));
      }
      if (matsList.length > 0 && !formData.material_id) {
        setFormData(prev => ({
          ...prev,
          material_id: prev.material_id || matsList[0].id
        }));
      }
    } catch (err) {
      console.error("Failed to load products/metadata", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      category_id: categories[0]?.id || "",
      material_id: materials[0]?.id || "",
      metadata: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category_id: product.category_id,
      material_id: product.material_id,
      metadata: product.metadata,
      image: product.image || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveProduct({
        id: editingId || undefined,
        ...formData,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.metadata.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? p.category_id === filterCategory : true;
    const matchesMaterial = filterMaterial ? p.material_id === filterMaterial : true;
    return matchesSearch && matchesCategory && matchesMaterial;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
              Products Database
            </h1>
            <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Create, modify, and manage the Jivanjor product catalogs
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search products, details..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterMaterial}
            onChange={(e) => { setFilterMaterial(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
          >
            <option value="">All Materials</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Database Table */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                  <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Product Info</th>
                  <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Target Material</th>
                  <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Attributes</th>
                  <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        <span>Retrieving products from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    const category = categories.find((c) => c.id === product.category_id);
                    const material = materials.find((m) => m.id === product.material_id);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-zinc-800 shrink-0 overflow-hidden relative flex items-center justify-center border border-gray-200 dark:border-zinc-700">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50">{product.name}</p>
                              <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                          {category ? category.name : "Unassigned"}
                        </td>
                        <td className="p-5 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                          {material ? material.name : "Unassigned"}
                        </td>
                        <td className="p-5">
                          <div className="flex flex-wrap gap-1.5">
                            {product.metadata.split(",").map((tag, idx) => {
                              const cleanTag = tag.trim();
                              if (!cleanTag) return null;
                              return (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
                                >
                                  {cleanTag}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500">
                      No products found matching the filter query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==================== CREATE/EDIT MODAL ==================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-[modalShow_0.2s_ease-out]">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50">
                  {editingId ? "Modify Product Details" : "Create Brand New Product"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. WaterShield 2-in-1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Product URL Slug</span>
                      <span className="text-[10px] text-red-500 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Auto
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="watershield-2-in-1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Assign Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Target Wood/Substrate Material
                    </label>
                    <select
                      value={formData.material_id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, material_id: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                    >
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    Attributes (Comma Separated Tags)
                  </label>
                  <input
                    type="text"
                    value={formData.metadata}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metadata: e.target.value }))}
                    placeholder="e.g. waterproof, high-bond, synthetic, marine-grade"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                  />
                </div>

                <ImageUpload
                  label="Illustration Image"
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  folder="products"
                />

                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    Product Specifications & Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Write detailed chemical bonding performance, coverage instructions, clamping time, safety details..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg"
                  >
                    {editingId ? "Save Modifications" : "Publish Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== DELETE CONFIRM DIALOG ==================== */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-normal font-medium">
                Are you absolutely sure you want to delete this product? This will permanently remove its catalog details, parameters, and metadata configurations from the local database.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `
      }} />
    </AdminLayout>
  );
}
