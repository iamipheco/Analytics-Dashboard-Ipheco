import userImage1 from "../assets/img/user1.png";
import userImage2 from "../assets/img/user2.png";
import userImage3 from "../assets/img/user3.png";
import userImage4 from "../assets/img/user4.png";
import userImage5 from "../assets/img/user5.png";

export const BRAND = "#34CAA5";

export const salesTrends = {
    weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [12, 18, 9, 24, 31, 42, 27],
    },
    monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [7, 20, 4, 30, 10, 45, 10, 22, 35, 5, 32, 28],
    },
    yearly: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        data: [180, 140, 210, 260, 245, 310],
    },
};

export const kpis = [
    { id: "orders", label: "Total Order", value: 350, change: 23.5, icon: "BoxTick", trend: [4, 6, 5, 8, 7, 9, 8, 11, 10, 13] },
    { id: "refunds", label: "Total Refund", value: 270, change: -23.5, icon: "I3DRotate", trend: [12, 10, 11, 9, 10, 7, 8, 6, 7, 5] },
    { id: "sales", label: "Average Sales", value: 1567, change: -23.5, icon: "ShoppingCart", trend: [9, 11, 8, 10, 7, 9, 6, 8, 5, 6] },
    { id: "income", label: "Total Income", value: 350000, change: 23.5, icon: "Coin1", prefix: "$", trend: [3, 5, 4, 7, 6, 8, 9, 8, 11, 12] },
];

const images = [userImage1, userImage2, userImage3, userImage4, userImage5];

export const orders = [
    ["Marcus Bergson", "2023-11-15", 80000, "Paid"],
    ["Jaydon Vaccaro", "2023-11-15", 150000, "Refund"],
    ["Corey Schleifer", "2023-11-14", 87000, "Paid"],
    ["Cooper Press", "2023-11-14", 100000, "Refund"],
    ["Phillip Lubin", "2023-11-13", 78000, "Paid"],
    ["Ahmad Rosser", "2023-11-12", 64000, "Paid"],
    ["Kianna Dias", "2023-11-11", 120500, "Paid"],
    ["Tatiana Geidt", "2023-11-10", 45200, "Refund"],
    ["Zaire Calzoni", "2023-11-09", 99000, "Paid"],
    ["Lincoln Herwitz", "2023-11-08", 51300, "Paid"],
].map(([name, date, amount, status], i) => ({
    id: `INV-${(1042 - i).toString().padStart(5, "0")}`,
    name,
    date,
    amount,
    status,
    userImage: images[i % images.length],
}));

export const platforms = [
    { name: "Book Bazaar", progress: 30, amount: 2500000, color: "#6160DC" },
    { name: "Artisan Aisle", progress: 60, amount: 1800000, color: "#54C5EB" },
    { name: "Toy Troop", progress: 50, amount: 1300000, color: "#FFB74A" },
    { name: "XStore", progress: 85, amount: 5456000, color: "#FF4A55" },
    { name: "Ipheco Elegant", progress: 95, amount: 5500000, color: "#34CAA5" },
    { name: "Gadget Grove", progress: 42, amount: 980000, color: "#A66CFF" },
    { name: "Home Haven", progress: 22, amount: 640000, color: "#F37BB8" },
];

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
