import userImage1 from "../assets/img/user1.png";
import userImage2 from "../assets/img/user2.png";
import userImage3 from "../assets/img/user3.png";
import userImage4 from "../assets/img/user4.png";
import userImage5 from "../assets/img/user5.png";

export const BRAND = "#34CAA5";

// Seeded RNG so the mock data is stable between reloads.
const mulberry32 = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const toIsoDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const images = [userImage1, userImage2, userImage3, userImage4, userImage5];

const customers = [
    "Marcus Bergson",
    "Jaydon Vaccaro",
    "Corey Schleifer",
    "Cooper Press",
    "Phillip Lubin",
    "Ahmad Rosser",
    "Kianna Dias",
    "Tatiana Geidt",
    "Zaire Calzoni",
    "Lincoln Herwitz",
];

export const ORDER_HISTORY_YEARS = 3;

export const platforms = [
    { name: "Book Bazaar", progress: 30, amount: 2500000, color: "#6160DC" },
    { name: "Artisan Aisle", progress: 60, amount: 1800000, color: "#54C5EB" },
    { name: "Toy Troop", progress: 50, amount: 1300000, color: "#FFB74A" },
    { name: "XStore", progress: 85, amount: 5456000, color: "#FF4A55" },
    { name: "Ipheco Elegant", progress: 95, amount: 5500000, color: "#34CAA5" },
    { name: "Gadget Grove", progress: 42, amount: 980000, color: "#A66CFF" },
    { name: "Home Haven", progress: 22, amount: 640000, color: "#F37BB8" },
];

const pickPlatform = (() => {
    const total = platforms.reduce((t, p) => t + p.amount, 0);
    return (r) => {
        let acc = 0;
        for (const p of platforms) {
            acc += p.amount / total;
            if (r < acc) return p.name;
        }
        return platforms[platforms.length - 1].name;
    };
})();

// About three years of orders up to today, newest first. Volume grows over time and peaks at weekends.
export const orders = (() => {
    const rand = mulberry32(2024);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = ORDER_HISTORY_YEARS * 365;
    const list = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const growth = 1 + (days - i) / days;
        const weekend = [0, 6].includes(date.getDay()) ? 1.4 : 1;
        const count = Math.floor(rand() * 3 * growth * weekend);
        for (let n = 0; n < count; n++) {
            const c = Math.floor(rand() * customers.length);
            list.push({
                name: customers[c],
                userImage: images[c % images.length],
                date: toIsoDate(date),
                amount: Math.round((500 + rand() * rand() * 14000) / 10) * 10,
                status: rand() < 0.12 ? "Refund" : "Paid",
                platform: pickPlatform(rand()),
            });
        }
    }
    return list.reverse().map((o, i) => ({ ...o, id: `INV-${String(list.length - i).padStart(5, "0")}` }));
})();

export const initialNotifications = [
    { id: 1, title: "New order received", body: "Marcus Bergson placed an order for $80,000.", time: "2m ago", read: false },
    { id: 2, title: "Refund requested", body: "Jaydon Vaccaro requested a refund.", time: "1h ago", read: false },
    { id: 3, title: "Weekly report ready", body: "Your sales report for last week is available.", time: "3h ago", read: false },
    { id: 4, title: "Platform milestone", body: "Ipheco Elegant passed $5.5M in revenue.", time: "Yesterday", read: true },
];

export const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
