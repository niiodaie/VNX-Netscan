export const categories = [
  { id: "apparel", title: "Apparel", items: ["Hoodie", "T‑Shirt", "Polo", "Cap"] },
  { id: "drinkware", title: "Drinkware", items: ["Mug", "Tumbler", "Bottle"] },
  { id: "office", title: "Office + Tech", items: ["Pen", "Notebook", "Charger"] },
  { id: "bags", title: "Bags", items: ["Tote", "Backpack", "Duffel"] },
  { id: "events", title: "Events + Displays", items: ["Banner", "Table Throw", "Pop‑Up"] },
  { id: "kits", title: "Gifts + Kits", items: ["Welcome Kit", "Client Kit"] },
];

export const products = [
  { id: "hoodie-premium", name: "Premium Fleece Hoodie", cat: "apparel", price: 38, min: 12 },
  { id: "tee-soft", name: "Soft Cotton Tee", cat: "apparel", price: 9, min: 12 },
  { id: "mug-classic", name: "Classic 11oz Mug", cat: "drinkware", price: 4.5, min: 24 },
  { id: "tumbler-insulated", name: "Insulated Tumbler 20oz", cat: "drinkware", price: 12, min: 24 },
  { id: "pen-smooth", name: "SmoothWrite Pen", cat: "office", price: 0.49, min: 100 },
  { id: "banner-vinyl", name: "Outdoor Vinyl Banner", cat: "events", price: 29, min: 1 },
  { id: "tote-canvas", name: "Canvas Tote", cat: "bags", price: 5.2, min: 24 },
  { id: "kit-welcome", name: "New Hire Welcome Kit", cat: "kits", price: 49, min: 10 },
];

export const decorationMethods = [
  "Screen Print",
  "DTG",
  "Embroidery",
  "Laser Engrave",
  "Pad Print"
];

export const placements = [
  "Front",
  "Back",
  "Left Chest",
  "Right Chest",
  "Wrap"
];

export const colors = [
  "Black",
  "White",
  "Navy",
  "Gray",
  "Red"
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categoryId) {
  return products.filter(p => p.cat === categoryId);
}

export function getCategoryById(id) {
  return categories.find(c => c.id === id);
}

