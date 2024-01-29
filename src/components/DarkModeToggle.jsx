import { Moon, Sun1 } from "iconsax-react";
import React, { useState, useEffect } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return { isDarkMode, toggleDarkMode };
};

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center w-[76px] h-[40px] lg:w-[89px] lg:h-[45px] bg-slate-200 rounded-full">
      <label htmlFor="darkModeToggle" className="cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="darkModeToggle"
            className="sr-only"
          />
          <div className=" text-slate-200 rounded-full shadow-inner relative">
            <div className={`${isDarkMode ? "translate-x-full md:translate-y-full" : ""} `} onClick={toggleDarkMode}>
              {isDarkMode ? (
                <div className="p-1 lg:p-2 bg-slate-600 rounded-full absolute -top-[15px] left-10 lg:-top-[19px] lg:left-[45px]">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
                
              ) : (<div className="p-1 lg:p-2 bg-[#34CAA5] rounded-full absolute lg:-top-[19px] -top-[15px] left-1"> <Sun1 size="22" color="#FFFFFF" variant="Bold" /></div>
               
              )}</div>
            </div>
          <div className=" text-slate-200 rounded-full shadow-inner relative ">
            <div className={`${isDarkMode ? "translate-y-full md:translate-x-full" : ""} `} onClick={toggleDarkMode}>
              {isDarkMode ? (
                <div className="p-1 lg:p-2 rounded-full absolute -top-[15px] left-[5px] lg:-top-[19px] lg:left-1"> <Sun1 size="22" color="#A3A3A3" variant="Bold " /></div>
                
              ) : (

              <div className="p-1 lg:p-2 rounded-full absolute -top-[15px] lg:-top-[20px] left-10 lg:left-[49px]">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
               
              )}</div>
            </div>
          </div>
        </label>
      </div>
  );
};

export default DarkModeToggle;