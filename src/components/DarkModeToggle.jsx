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
    <div className="flex items-center">
      <label htmlFor="darkModeToggle" className="cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="darkModeToggle"
            className="sr-only"
          />
          <div className="md:w-[30px] md:h-[60px] bg-[#FFFFFF] rounded-full shadow-inner">
            <div className={`${isDarkMode ? "translate-y-full" : ""} `} onClick={toggleDarkMode}>
              {isDarkMode ? (
                <div className="p-1 bg-[#cbcbcb] rounded-full">
                  <Moon size="22" color="#B2ABAB" variant="Bold"/></div>
                
              ) : (<div className="p-1 bg-[#34CAA5] rounded-full"> <Sun1 size="22" color="#FFFFFF" variant="Bold" /></div>
               
              )}</div>
            </div>
          </div>
        </label>
      </div>
  );
};

export default DarkModeToggle;