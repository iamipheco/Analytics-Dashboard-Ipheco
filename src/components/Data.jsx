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
        link: "/",
        icon: <TrendUp color="#697689" variant="Broken"/>,
    },
    {
        name: "User",
        link: "/",
        icon: <Profile2User color="#697689" variant="Broken"/>,
    },
    {
        name: "Messages",
        link: "/",
        icon: <Box color="#697689" variant="Broken"/>,
    },
    {
        name: "Products",
        link: "/",
        icon: <DiscountShape color="#697689" variant="Broken"/>,
    },
    {
        name: "Support",
        link: "/",
        icon: <InfoCircle color="#697689" variant="Broken"/>,
    },
    {
        name: "Tips", 
        link: "/",
        icon: <ArrowCircleRight2 color="#697689" variant="Broken"/>,
        margin: true,
    },
    {
        name: "Settings",
        link: "/",
        icon: <Setting2 color="#697689" variant="Broken"/>,
    },
    {
        name: "Logout",
        link: "/",
        icon: <Logout color="#697689" variant="Broken"/>
    }
];


