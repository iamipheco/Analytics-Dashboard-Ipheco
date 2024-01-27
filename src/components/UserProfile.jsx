import React, { useRef, useState, useEffect } from "react";
import UserProfPic from "../assets/img/user-prof.jpg";
import { ArrowDown2 } from "iconsax-react";

const UserProfile = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userProRef = useRef(null)

    const handleArrowClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
     const handleClickOutside = (e) => {
        if(userProRef.current && !userProRef.current.contains(e.target)){
            setIsDropdownOpen(false)
    }
     };

     document.addEventListener("mousedown", handleClickOutside)
     return () => {
        document.removeEventListener("mousedown", handleClickOutside)
     }
    }, [userProRef])
    

    return (
        <>
            <div

                className=" relative flex border rounded-full justify-center items-center px-1 py-1 lg:px-2 lg:py-2 gap-2 lg:gap-4 lg:mx-2"
                style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "#787486",
                    
                }}
            >
                <img
                    src={UserProfPic}
                    alt="user-prof"
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full"
                />
                <div className="leading-4 hidden lg:block dark:lg:block ">
                    <h4 className="text-[14px] text-right font-normal text-[#26282C] dark:text-white"
                    >
                        Justin Bergson
                    </h4>
                    <p
                        className="text-[12px] pt-1 text-right font-extralight color-[#787486] dark:text-slate-400"
                    >
                        justin@gmail.com
                    </p>
                </div>
                <div
                    ref={userProRef}
                    className="hover:bg-[#34CAA5]  hover:rounded-full p-1"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleArrowClick}
                >
                    <ArrowDown2
                        size="16"
                        color={isHovered ? "#fff" : "#697689"}
                        variant="Outline"
                    />
                </div>
                {isDropdownOpen && (
                    <div className="absolute md:left=8 top-8 sm:top-9 md:top-12 mt-2 lg:top-[55px] lg:right-2 dark:text-white dark:bg-slate-800 bg-white dark:font-medium  rounded-md ">
                        <ul className="py-2">
                            <li className="px-3 py-[2px] sm:py-1 sm:px-4  md:px-6 lg:px-10 lg:py- hover:bg-[#34CAA5] dark:text-[#34CAA5] dark:hover:text-white cursor-pointer">
                            Account
                            </li>
                            <li className="px-3 py-[2px] sm:py-1 sm:px-4  md:px-6 lg:px-10 lg:py-2 hover:bg-[#34CAA5] dark:text-[#34CAA5] dark:hover:text-white cursor-pointer">
                                Profile
                            </li>
                            <li className="px-3 py-[2px] sm:py-1 sm:px-4  md:px-6 lg:px-10 lg:py-2 hover:bg-[#34CAA5] dark:text-[#34CAA5] dark:hover:text-white cursor-pointer">
                                Product
                            </li>
                            <li className="px-3 py-[2px] sm:py-1 sm:px-4  md:px-6 lg:px-10 lg:py-2 hover:bg-[#34CAA5] dark:hover:text-red-800 cursor-pointer text-red-700">
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserProfile;
