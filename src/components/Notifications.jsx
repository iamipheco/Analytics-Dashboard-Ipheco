import React, { useState } from "react";
import { Notification1 } from "iconsax-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleBellClick = () => {
        // Show an overlay message
        toast.info("You have an unread message", {
            position: toast.POSITION.TOP_LEFT,
        });
    };

    return (
        <div className="relative">
            <div
                className="border rounded-full p-2 transition-colors duration-500 ease-in-out hover:bg-[#34CAA5]  hover:border-[#34CAA5] cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleBellClick}
            >
                <Notification1
                    size="18"
                    color={isHovered ? "#fff" : "#697689"}
                    variant="Broken"
                    className="w-[16px] sm:w-[18px] md:w-[22px] lg:w-[24px] h-16px sm:h-[18px] md:h-[22px] lg:h-[24px] "
                />

                {/* Badge for unread messages */}
                <div className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-semibold">
                    3
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Notifications;
