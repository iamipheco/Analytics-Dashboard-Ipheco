import { users } from "./usersData";

const MIN = 60 * 1000;

// [customer name, minutes ago the thread starts, [[from, text, minutes after previous], ...], unread count]
const threads = [
    [
        "Marcus Bergson",
        95,
        [
            ["them", "Hi! I placed an order this morning, INV-01042. Any idea when it ships?", 0],
            ["me", "Hi Marcus, thanks for ordering! It's packed and goes out with this afternoon's courier.", 6],
            ["them", "Perfect. Will I get a tracking link?", 70],
            ["them", "Also, can I change the delivery address to my office?", 4],
        ],
        2,
    ],
    [
        "Jaydon Vaccaro",
        260,
        [
            ["them", "The headphones I received have a crackle in the left ear.", 0],
            ["me", "Sorry about that, Jaydon. I've started a refund. You'll see it in 3–5 business days.", 15],
            ["them", "Thanks for sorting it out so quickly 🙏", 30],
        ],
        0,
    ],
    [
        "Kianna Dias",
        1500,
        [
            ["them", "Do you offer wholesale pricing for the beeswax candle sets?", 0],
            ["me", "We do! Orders of 50+ get 20% off. Want me to send a quote?", 40],
            ["them", "Yes please, for 80 sets delivered to Lisbon.", 120],
        ],
        1,
    ],
    [
        "Phillip Lubin",
        2900,
        [
            ["me", "Hi Phillip, the mechanical keyboard you asked about is back in stock.", 0],
            ["them", "Great, just ordered one. Thanks for the heads-up!", 50],
        ],
        0,
    ],
    [
        "Hana Suzuki",
        4400,
        [
            ["them", "Is international shipping to Japan available?", 0],
            ["me", "Yes, we ship to Japan with tracking. It usually takes 7–10 days.", 25],
            ["them", "And are customs fees included?", 12],
        ],
        1,
    ],
    [
        "Tatiana Geidt",
        8600,
        [
            ["them", "I'd like to return the linen throw. The colour isn't what I expected.", 0],
            ["me", "No problem. I've emailed you a prepaid return label.", 90],
        ],
        0,
    ],
];

export const initialConversations = (() => {
    const now = Date.now();
    return threads.map(([name, startedMinutesAgo, lines, unread], i) => {
        const user = users.find((u) => u.name === name);
        let t = now - startedMinutesAgo * MIN;
        const messages = lines.map(([from, text, after], j) => {
            t += after * MIN;
            return { id: `${i}-${j}`, from, text, time: new Date(Math.min(t, now)).toISOString() };
        });
        return { id: i + 1, name, image: user?.image ?? null, email: user?.email ?? "", unread, messages };
    });
})();

export const autoReplies = [
    "Thanks! That helps a lot.",
    "Got it, I appreciate the quick reply.",
    "Sounds good to me 👍",
    "Okay, I'll keep an eye out for it.",
    "Perfect, thank you!",
];
