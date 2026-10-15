export const SUPPORT_EMAIL = "support@fasta.app";
export const SUPPORT_PHONE = "+1 (555) 014-2290";

export const TOPICS = ["Orders", "Payments & refunds", "Products", "Account"];

export const PRIORITIES = ["Low", "Normal", "Urgent"];

export const faqs = [
    {
        topic: "Orders",
        q: "How do I find a specific order?",
        a: "Use the search box in the header on the Dashboard. You can search by customer name or invoice number, and the Last Orders table filters as you type. Open “See All” to browse every order.",
    },
    {
        topic: "Orders",
        q: "Can I export my orders?",
        a: "Yes. In Last Orders, click the download icon next to the filters. It exports the orders currently shown, including any Paid or Refund filter, as a CSV file you can open in Excel or Google Sheets.",
    },
    {
        topic: "Orders",
        q: "How do I print an invoice?",
        a: "Click “View” on any order to open the invoice, then choose Print. If nothing happens, allow pop-ups for this site in your browser.",
    },
    {
        topic: "Payments & refunds",
        q: "How do I refund an order?",
        a: "Open the order's invoice from Last Orders and choose “Mark as refunded”. The status changes straight away, and you can switch it back to paid from the same place.",
    },
    {
        topic: "Payments & refunds",
        q: "When do customers get their money back?",
        a: "Refunds usually reach the customer's account within 3–5 business days, depending on their bank.",
    },
    {
        topic: "Products",
        q: "How do I add a new product?",
        a: "Go to Products and click “Add product”. Fill in the name, SKU, category, price and stock, then save. Each SKU must be unique.",
    },
    {
        topic: "Products",
        q: "What does “Low stock” mean?",
        a: "A product is marked Low stock when 10 or fewer are left, and Out of stock at 0. You can turn on low stock alerts in Settings → Notifications.",
    },
    {
        topic: "Account",
        q: "How do I change my name or profile photo?",
        a: "Open Settings, or choose “My profile” from the menu under your avatar. Update your details and click “Save profile”. The header updates straight away.",
    },
    {
        topic: "Account",
        q: "How do I switch to dark mode?",
        a: "Use the sun and moon toggle in the sidebar, the option in your avatar menu, or Settings → Appearance. Your choice is remembered on this device.",
    },
    {
        topic: "Account",
        q: "How do I undo my changes to the demo data?",
        a: "Go to Settings → Reset demo data. Products, your profile and notification settings go back to how they started.",
    },
];
