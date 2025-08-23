import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import SocialLinks from "../components/SocialLinks";

export default function Catalog({ categories, products, nav }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.cat === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Polished Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Product Catalog</h1>
        <p className="text-lg text-neutral-600 mt-3 max-w-2xl mx-auto">
          Discover our complete collection of customizable products. 
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-neutral-600">
          Showing {filteredProducts.length} of {products.length} products
          {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.title}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} nav={nav} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-neutral-500 text-lg">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Connect with us</h3>
          <div className="flex justify-center">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}

