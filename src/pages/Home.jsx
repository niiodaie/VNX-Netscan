import React from "react";
import Hero from "../components/Hero";
import USPStrip from "../components/USPStrip";
import PromoStrip from "../components/PromoStrip";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Testimonial from "../components/Testimonial";

export default function Home({ nav }) {
  const categories = [
    { id: "apparel", title: "Apparel", items: ["Hoodie", "T‑Shirt", "Polo", "Cap"] },
    { id: "drinkware", title: "Drinkware", items: ["Mug", "Tumbler", "Bottle"] },
    { id: "office", title: "Office + Tech", items: ["Pen", "Notebook", "Charger"] },
    { id: "bags", title: "Bags", items: ["Tote", "Backpack", "Duffel"] },
    { id: "events", title: "Events + Displays", items: ["Banner", "Table Throw", "Pop‑Up"] },
    { id: "kits", title: "Gifts + Kits", items: ["Welcome Kit", "Client Kit"] },
  ];

  const featuredProducts = [
    { id: "hoodie-premium", name: "Premium Fleece Hoodie", cat: "apparel", price: 38, min: 12 },
    { id: "mug-classic", name: "Classic 11oz Mug", cat: "drinkware", price: 4.5, min: 24 },
    { id: "tote-canvas", name: "Canvas Tote", cat: "bags", price: 5.2, min: 24 },
  ];

  const testimonials = [
    { quote: "VisPrint made ordering custom apparel so easy! The quality is fantastic and the turnaround was super fast.", author: "Sarah L.", title: "Small Business Owner" },
    { quote: "Our new promotional pens are a hit! VisPrint delivered exactly what we needed, on time and on budget.", author: "Mark T.", title: "Marketing Manager" },
    { quote: "The welcome kits for our new hires were perfect. Great attention to detail and excellent service.", author: "Emily R.", title: "HR Director" },
  ];

  return (
    <>
      <PromoStrip />
      <Hero nav={nav} />
      <USPStrip />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Shop by Category</h2>
        <p className="text-neutral-600 mt-2 text-center">Explore our wide range of customizable products.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} nav={nav} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 bg-neutral-100 rounded-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Featured Products</h2>
        <p className="text-neutral-600 mt-2 text-center">Our most popular items, ready for your brand.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} nav={nav} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">What Our Clients Say</h2>
        <p className="text-neutral-600 mt-2 text-center">Don't just take our word for it – hear from our satisfied customers.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} quote={testimonial.quote} author={testimonial.author} title={testimonial.title} />
          ))}
        </div>
      </section>
    </>
  );
}

