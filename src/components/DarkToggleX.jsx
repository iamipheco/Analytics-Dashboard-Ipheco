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

const DarkToggleX = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center w-[76px] h-[40px] lg:w-[40px] lg:h-[76px] bg-slate-300 rounded-full">
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
                <div className="p-1 bg-slate-600 rounded-full absolute top-1 -right-[35px]">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
                
              ) : (<div className="p-1 bg-[#34CAA5] rounded-full absolute bottom-1 left-[5px]"> <Sun1 size="22" color="#FFFFFF" variant="Bold" /></div>
               
              )}</div>
            </div>
          <div className=" text-slate-200 rounded-full shadow-inner relative ">
            <div className={`${isDarkMode ? "translate-y-full md:translate-x-full" : ""} `} onClick={toggleDarkMode}>
              {isDarkMode ? (
                <div className="p-1 rounded-full absolute bottom-1 left-[5px]"> <Sun1 size="22" color="#A3A3A3" variant="Bold " /></div>
                
              ) : (

              <div className="p-1 bg-[#cbcbcb] rounded-full absolute top-1
               left-[5px]">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
               
              )}</div>
            </div>
          </div>
        </label>
      </div>
  );
};

export default DarkToggleX;