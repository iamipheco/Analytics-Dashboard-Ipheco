import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import UserProfile from "./UserProfile";
import Notifications from "./Notifications";
import CalendarPaper from "./CalendarPaper";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className=" p-5 flex justify-center items-center border-b-[3px] border-b-[#f4f4f4] bg-[#fafafa] dark:bg-slate-800 dark:border-slate-600 dark:border-b-[2px] ">
                <div className=" mb-1 sm:mb-1 ml-16 lg:ml-5  flex-auto lg:w-60 text-[12px] sm:text-[16px] lg:text-[16px] dark:text-white text-[#26282C] font-semibold transition-all duration-700">
                    Dashboard
                </div>
                <div className="mr-5 ">
                    <div className="relative">
                        <CiSearch
                            className="lg:absolute lg:left-3 lg:top-1/2 lg:transform lg:-translate-y-1/2 dark:text-white text-gray-500 text-[22px]"
                            
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-white dark:bg-slate-700 rounded-full border dark:border-[1px] border-slate-600 pl-10 pr-4 py-2 outline-none placeholder-middle placeholder:dark:text-white dark:text-white hidden lg:block "
                        />
                    </div>
                </div>
                <div className="mr-4 hidden md:block">
                    <CalendarPaper />
                </div>
                <div className="mr-5 md-:shrink-0">
                    <Notifications />
                </div>
                <div className="mr-5 md:shrink-0">
                    <UserProfile />
                </div>
            </div>
        </>
    );
};

export default Header;
