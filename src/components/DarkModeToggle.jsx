import { Moon, Sun1 } from "iconsax-react";
import React, { useState, useEffect } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

//   useEffect(() => {
//     document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
//     localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
//   }, [isDarkMode]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(prevMode => !prevMode);
//   };

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
    <div className="flex items-center w-[64px] h-[36px] lg:w-[42px] lg:h-[24px] bg-slate-300 rounded-full">
      <label htmlFor="darkModeToggle" className="cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="darkModeToggle"
            className="sr-only"
          />
          <div className=" text-slate-200 rounded-full shadow-inner absolute -top-[14px] -right-8">
            <div className={`${isDarkMode ? "translate-x-full md:translate-y-full" : ""} `} onClick={toggleDarkMode}>
              {isDarkMode ? (
                <div className="p-[3px] bg-slate-600 rounded-full">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
                
              ) : (<div className="p-[3px] bg-[#34CAA5] rounded-full"> <Sun1 size="22" color="#FFFFFF" variant="Bold" /></div>
               
              )}</div>
            </div>
          <div className=" text-slate-200 rounded-full shadow-inner relative ">
            <div className={`${isDarkMode ? "translate-y-full md:translate-x-full" : ""} `} onClick={toggleDarkMode}>
              {isDarkMode ? (
                <div className="p-[3px] rounded-full absolute -top-[14px] -right-8"> <Sun1 size="22" color="#A3A3A3" variant="Bold " /></div>
                
              ) : (

              <div className="p-[3px] bg-[#cbcbcb] rounded-full absolute -top-[14px] -right-[60px]">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
               
              )}</div>
            </div>
          </div>
        </label>
      </div>
  );
};

export default DarkModeToggle;