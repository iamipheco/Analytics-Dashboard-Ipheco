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


export const sideData = [
    {
        name: "Dashboard",
        link: "/",
        icon: <Category color="#697689" variant="Bulk"/>,
    },
    {
        name: "Analytics",
        link: "/analytics",
        icon: <TrendUp color="#697689" variant="Broken"/>,
    },
    {
        name: "User",
        link: "/user",
        icon: <Profile2User color="#697689" variant="Broken"/>,
    },
    {
        name: "Messages",
        link: "/messages",
        icon: <Box color="#697689" variant="Broken"/>,
    },
    {
        name: "Products",
        link: "/products",
        icon: <DiscountShape color="#697689" variant="Broken"/>,
    },
    {
        name: "Support",
        link: "/support",
        icon: <InfoCircle color="#697689" variant="Broken"/>,
    },
    {
        name: "Tips", 
        link: "/tips",
        icon: <ArrowCircleRight2 color="#697689" variant="Broken"/>,
        margin: true,
    },
    {
        name: "Settings",
        link: "/settings",
        icon: <Setting2 color="#697689" variant="Broken"/>,
    },
    {
        name: "Logout",
        link: "/logout",
        icon: <Logout color="#697689" variant="Broken"/>
    }
];


