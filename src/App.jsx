import React, { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SkipLink from "./components/SkipLink";
import SEOHead, { seoConfigs, getProductSEO } from "./components/SEOHead";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import QuoteBuilder from "./pages/Quote";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  return <VisPrintMockSite />;
}

function VisPrintMockSite() {
  const [route, setRoute] = useState({ name: "home" });
  const [cart, setCart] = useState([]);
  const [logo, setLogo] = useState(null);

  function nav(to) {
    setRoute(typeof to === "string" ? { name: to } : to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const categories = [
    { id: "apparel", title: "Apparel", items: ["Hoodie", "T‑Shirt", "Polo", "Cap"] },
    { id: "drinkware", title: "Drinkware", items: ["Mug", "Tumbler", "Bottle"] },
    { id: "office", title: "Office + Tech", items: ["Pen", "Notebook", "Charger"] },
    { id: "bags", title: "Bags", items: ["Tote", "Backpack", "Duffel"] },
    { id: "events", title: "Events + Displays", items: ["Banner", "Table Throw", "Pop‑Up"] },
    { id: "kits", title: "Gifts + Kits", items: ["Welcome Kit", "Client Kit"] },
  ];

  const allProducts = useMemo(() => (
    [
      { id: "hoodie-premium", name: "Premium Fleece Hoodie", cat: "apparel", price: 38, min: 12 },
      { id: "tee-soft", name: "Soft Cotton Tee", cat: "apparel", price: 9, min: 12 },
      { id: "mug-classic", name: "Classic 11oz Mug", cat: "drinkware", price: 4.5, min: 24 },
      { id: "tumbler-insulated", name: "Insulated Tumbler 20oz", cat: "drinkware", price: 12, min: 24 },
      { id: "pen-smooth", name: "SmoothWrite Pen", cat: "office", price: 0.49, min: 100 },
      { id: "banner-vinyl", name: "Outdoor Vinyl Banner", cat: "events", price: 29, min: 1 },
      { id: "tote-canvas", name: "Canvas Tote", cat: "bags", price: 5.2, min: 24 },
      { id: "kit-welcome", name: "New Hire Welcome Kit", cat: "kits", price: 49, min: 10 },
    ]
  ), []);

  const routeProduct = route.name === "product" ? allProducts.find(p => p.id === route.id) : null;

  // Get SEO config for current route
  const getSEOConfig = () => {
    if (route.name === "product" && routeProduct) {
      return getProductSEO(routeProduct);
    }
    return seoConfigs[route.name] || seoConfigs.home;
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SEOHead {...getSEOConfig()} />
      <SkipLink />
      <Navbar nav={nav} />

      <main id="main-content" role="main">
        {route.name === "home" && <Home nav={nav} />}
        {route.name === "catalog" && <Catalog categories={categories} products={allProducts} nav={nav} />}
        {route.name === "product" && routeProduct && (
          <Product product={routeProduct} nav={nav} cart={cart} setCart={setCart} logo={logo} setLogo={setLogo} />
        )}
        {route.name === "quote" && <QuoteBuilder cart={cart} setCart={setCart} nav={nav} logo={logo} setLogo={setLogo} />}
        {route.name === "pricing" && <Pricing nav={nav} />}
        {route.name === "about" && <About />}
        {route.name === "contact" && <Contact />}
        {route.name === "dashboard" && <Dashboard cart={cart} />}
        {route.name === "login" && <Login />}
      </main>

      <Footer nav={nav} />
    </div>
  );
}



