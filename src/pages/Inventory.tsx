import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  riskLevel: "low" | "medium" | "high";
}

// Mock data for demo
const mockProducts: Product[] = [
  { id: "1", name: "Classmate Notebooks A4", category: "Stationery", brand: "Classmate", sku: "CLM-NB-A4-001", currentStock: 45, reorderLevel: 50, riskLevel: "medium" },
  { id: "2", name: "Pilot Pen Blue", category: "Writing", brand: "Pilot", sku: "PLT-PEN-BL-002", currentStock: 120, reorderLevel: 30, riskLevel: "low" },
  { id: "3", name: "Faber-Castell Erasers", category: "Stationery", brand: "Faber-Castell", sku: "FC-ERS-001", currentStock: 8, reorderLevel: 25, riskLevel: "high" },
  { id: "4", name: "Doms Pencils HB", category: "Writing", brand: "DOMS", sku: "DOM-PCL-HB-003", currentStock: 200, reorderLevel: 100, riskLevel: "low" },
  { id: "5", name: "Stapler Medium", category: "Office Supplies", brand: "Kangaro", sku: "KNG-STP-MD-004", currentStock: 15, reorderLevel: 20, riskLevel: "medium" },
];

const categories = ["All", "Stationery", "Writing", "Office Supplies"];
const brands = ["All", "Classmate", "Pilot", "Faber-Castell", "DOMS", "Kangaro"];

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    sku: "",
    currentStock: 0,
    reorderLevel: 0,
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRiskBadge = (level: string) => {
    const styles = {
      low: "bg-primary/10 text-primary",
      medium: "bg-warning/10 text-warning",
      high: "bg-destructive/10 text-destructive",
    };
    return styles[level as keyof typeof styles] || styles.low;
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "", brand: "", sku: "", currentStock: 0, reorderLevel: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingProduct) {
      setProducts(products.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...formData, riskLevel: formData.currentStock < formData.reorderLevel ? "high" : formData.currentStock < formData.reorderLevel * 1.5 ? "medium" : "low" }
          : p
      ));
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        riskLevel: formData.currentStock < formData.reorderLevel ? "high" : formData.currentStock < formData.reorderLevel * 1.5 ? "medium" : "low",
      };
      setProducts([...products, newProduct]);
      toast.success("Product added successfully");
    }

    setIsLoading(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your products, stock levels, and SKUs
            </p>
          </div>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field w-auto min-w-[150px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="input-field w-auto min-w-[150px]"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand === "All" ? "All Brands" : brand}</option>
            ))}
          </select>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Product</th>
                  <th className="text-left py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">SKU</th>
                  <th className="text-left py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Category</th>
                  <th className="text-left py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Brand</th>
                  <th className="text-center py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Stock</th>
                  <th className="text-center py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Risk</th>
                  <th className="text-right py-4 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground font-mono text-sm">{product.sku}</td>
                    <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-4 px-4 text-muted-foreground">{product.brand}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${product.currentStock < product.reorderLevel ? "text-destructive" : "text-foreground"}`}>
                        {product.currentStock}
                      </span>
                      <span className="text-muted-foreground text-sm"> / {product.reorderLevel}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getRiskBadge(product.riskLevel)}`}>
                        {product.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-foreground">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Classmate Notebooks A4"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Stationery"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="e.g., Classmate"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g., CLM-NB-A4-001"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Stock</label>
                      <input
                        type="number"
                        value={formData.currentStock}
                        onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Reorder Level</label>
                      <input
                        type="number"
                        value={formData.reorderLevel}
                        onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {editingProduct ? "Update" : "Add"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
