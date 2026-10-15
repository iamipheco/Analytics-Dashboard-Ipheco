export const BILLING_KEY = "billing";

// Yearly billing charges 10 months for 12.
export const YEARLY_MONTHS = 10;

export const plans = [
    {
        id: "starter",
        name: "Starter",
        monthly: 19,
        description: "For new stores finding their feet.",
        limits: { products: 100, seats: 1, storage: 5 },
        features: ["Up to 100 products", "1 team member", "5 GB storage", "Email support"],
    },
    {
        id: "pro",
        name: "Pro",
        monthly: 49,
        description: "For growing stores that sell every day.",
        limits: { products: 1000, seats: 5, storage: 50 },
        features: ["Up to 1,000 products", "5 team members", "50 GB storage", "Analytics & exports", "Priority support"],
        popular: true,
    },
    {
        id: "business",
        name: "Business",
        monthly: 129,
        description: "For established teams at scale.",
        limits: { products: Infinity, seats: 20, storage: 500 },
        features: ["Unlimited products", "20 team members", "500 GB storage", "Advanced analytics", "Dedicated manager"],
    },
];

export const planPrice = (plan, interval) => (interval === "yearly" ? plan.monthly * YEARLY_MONTHS : plan.monthly);

const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addMonths = (date, n) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + n);
    return d;
};

export const nextRenewal = (interval, from = new Date()) => toIso(addMonths(from, interval === "yearly" ? 12 : 1));

export const initialBilling = (() => {
    const today = new Date();
    const anchor = new Date(today.getFullYear(), today.getMonth(), 3);
    const lastCharge = anchor > today ? addMonths(anchor, -1) : anchor;
    return {
        plan: "pro",
        interval: "monthly",
        renews: toIso(addMonths(lastCharge, 1)),
        cancelled: false,
        card: { brand: "Visa", last4: "4242", expMonth: 8, expYear: today.getFullYear() + 2, name: "Justin Bergson" },
        email: "billing@fasta.app",
        seatsUsed: 3,
        storageUsed: 18.4,
        invoices: Array.from({ length: 8 }, (_, i) => ({
            id: `FA-${String(2400 + 8 - i).padStart(5, "0")}`,
            date: toIso(addMonths(lastCharge, -i)),
            description: "Pro plan · Monthly",
            amount: 49,
            status: "Paid",
        })),
    };
})();

export const loadBilling = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(BILLING_KEY));
        if (stored && typeof stored === "object" && stored.card) return stored;
    } catch {
        // storage unavailable or corrupt
    }
    return initialBilling;
};

export const cardBrand = (digits) => {
    if (/^4/.test(digits)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "Amex";
    if (/^6(011|5)/.test(digits)) return "Discover";
    return "Card";
};

// Luhn checksum, the standard check-digit test for card numbers.
export const isValidCardNumber = (digits) => {
    if (!/^\d{13,19}$/.test(digits)) return false;
    let sum = 0;
    [...digits].reverse().forEach((ch, i) => {
        let n = Number(ch);
        if (i % 2) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
    });
    return sum % 10 === 0;
};

export { toIso };
