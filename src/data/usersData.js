import userImage1 from "../assets/img/user1.png";
import userImage2 from "../assets/img/user2.png";
import userImage3 from "../assets/img/user3.png";
import userImage4 from "../assets/img/user4.png";
import userImage5 from "../assets/img/user5.png";

export const ACTIVE_DAYS = 90; // ordered within this many days = active

// Seeded RNG so the mock data is stable between reloads.
const mulberry32 = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const images = [userImage1, userImage2, userImage3, userImage4, userImage5];

const people = [
    ["Marcus Bergson", "Lagos, NG"],
    ["Jaydon Vaccaro", "Austin, US"],
    ["Corey Schleifer", "Berlin, DE"],
    ["Cooper Press", "Toronto, CA"],
    ["Phillip Lubin", "Nairobi, KE"],
    ["Ahmad Rosser", "Dubai, AE"],
    ["Kianna Dias", "Lisbon, PT"],
    ["Tatiana Geidt", "London, UK"],
    ["Zaire Calzoni", "Milan, IT"],
    ["Lincoln Herwitz", "Sydney, AU"],
    ["Amara Okafor", "Abuja, NG"],
    ["Hana Suzuki", "Osaka, JP"],
    ["Diego Ramos", "Mexico City, MX"],
    ["Freya Lund", "Oslo, NO"],
    ["Samuel Mensah", "Accra, GH"],
    ["Priya Nair", "Bengaluru, IN"],
    ["Elena Petrova", "Sofia, BG"],
    ["Noah Fischer", "Zurich, CH"],
];

const DAY = 24 * 60 * 60 * 1000;

const toIso = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const users = (() => {
    const rand = mulberry32(7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let invoice = 2000;

    return people.map(([name, location], i) => {
        const joinedDaysAgo = 60 + Math.floor(rand() * 700);
        const orderCount = 1 + Math.floor(rand() * 9);
        // Some customers have gone quiet, so not everyone is active.
        const quietFor = rand() < 0.3 ? 100 + Math.floor(rand() * 200) : 0;
        const orders = Array.from({ length: orderCount }, () => {
            const daysAgo = quietFor + Math.floor(rand() * (joinedDaysAgo - quietFor));
            return {
                id: `INV-${String(invoice++).padStart(5, "0")}`,
                date: toIso(today.getTime() - daysAgo * DAY),
                amount: Math.round((40 + rand() * 900) * 100) / 100,
                status: rand() < 0.12 ? "Refund" : "Paid",
            };
        }).sort((a, b) => b.date.localeCompare(a.date));

        const paid = orders.filter((o) => o.status === "Paid");
        const lastOrder = orders[0].date;
        const daysSinceLast = Math.round((today - new Date(`${lastOrder}T00:00:00`)) / DAY);

        return {
            id: i + 1,
            name,
            email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
            location,
            image: i < images.length ? images[i] : null,
            joined: toIso(today.getTime() - joinedDaysAgo * DAY),
            orders,
            orderCount: orders.length,
            totalSpent: Math.round(paid.reduce((t, o) => t + o.amount, 0) * 100) / 100,
            refunds: orders.length - paid.length,
            lastOrder,
            status: daysSinceLast <= ACTIVE_DAYS ? "Active" : "Inactive",
        };
    });
})();
