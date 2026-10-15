export const CATEGORIES = ["Books", "Crafts", "Toys", "Electronics", "Home"];

export const LOW_STOCK = 10;

export const stockStatus = (stock) => {
    if (stock === 0) return "Out of stock";
    if (stock <= LOW_STOCK) return "Low stock";
    return "In stock";
};

export const initialProducts = [
    ["The Silent Orchard", "BK-1001", "Books", 24.99, 120, 842],
    ["Atlas of Small Places", "BK-1002", "Books", 39.5, 8, 311],
    ["Midnight Recipes", "BK-1003", "Books", 29, 0, 527],
    ["Hand-thrown Mug", "CR-2001", "Crafts", 32, 46, 690],
    ["Woven Wall Hanging", "CR-2002", "Crafts", 85, 5, 143],
    ["Beeswax Candle Set", "CR-2003", "Crafts", 18.75, 210, 1204],
    ["Wooden Train Set", "TY-3001", "Toys", 54.99, 33, 402],
    ["Plush Fox", "TY-3002", "Toys", 22, 0, 958],
    ["Stacking Rainbow", "TY-3003", "Toys", 27.5, 64, 377],
    ["Wireless Earbuds", "EL-4001", "Electronics", 89, 18, 1530],
    ["Smart Desk Lamp", "EL-4002", "Electronics", 64.99, 3, 488],
    ["Portable Charger 20k", "EL-4003", "Electronics", 45, 150, 2011],
    ["Mechanical Keyboard", "EL-4004", "Electronics", 129, 22, 615],
    ["Linen Throw Blanket", "HM-5001", "Home", 72, 40, 529],
    ["Ceramic Planter", "HM-5002", "Home", 26, 9, 806],
    ["Cotton Bath Towels", "HM-5003", "Home", 48, 75, 433],
].map(([name, sku, category, price, stock, sold], i) => ({ id: i + 1, name, sku, category, price, stock, sold }));

export const PRODUCTS_KEY = "products";

// Edits are kept in this browser so they survive a reload.
export const loadProducts = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
        if (Array.isArray(stored)) return stored;
    } catch {
        // storage unavailable or corrupt: fall back to the demo data
    }
    return initialProducts;
};
