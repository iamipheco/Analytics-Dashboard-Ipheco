import {
    Profile2User,
    Category,
    TrendUp,
    Box,
    DiscountShape,
    InfoCircle,
    Setting2,
    ArrowCircleRight2,
    Logout,
} from "iconsax-react";

// Icons inherit the link's text color so hover/active styling is pure CSS.
export const sideData = [
    { name: "Dashboard", link: "/", icon: Category },
    { name: "Analytics", link: "/analytics", icon: TrendUp },
    { name: "User", link: "/users", icon: Profile2User },
    { name: "Messages", link: "/messages", icon: Box },
    { name: "Products", link: "/products", icon: DiscountShape },
    { name: "Support", link: "/support", icon: InfoCircle },
    { name: "Tips", link: "/tips", icon: ArrowCircleRight2, section: "bottom" },
    { name: "Settings", link: "/settings", icon: Setting2, section: "bottom" },
    { name: "Logout", action: "logout", icon: Logout, section: "bottom" },
];
