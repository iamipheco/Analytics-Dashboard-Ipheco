import React from "react";

const ProgressBar = ({ name, progress, amount, color }) => {
  return (
    <div className="bg-white shadow rounded px-3  dark:bg-slate-700 dark:text-white">
      <h2 className="text-xs font-semibold mb-2">{name}</h2>
      <div className="relative w-full h-2 bg-gray-200 rounded-full  dark:bg-slate-300 dark:text-white">
      <div
          className={`absolute top-0 left-0 h-2 rounded-full`}
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="flex justify-between font-normal text-xs mt-1 mb-[10px]">
      <p  className="text-gray-600 dark:text-slate-400">${amount}</p>
      <p className="text-gray-600 dark:text-slate-400 ">+{progress}% </p>
      </div>
    </div>
  );
};

const Platforms = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow p-2  dark:bg-slate-700 dark:text-white">
      <div className="flex justify-between px-3 p-2 mb-3">
        <p className="font-semibold text-sm text-[#26282C] dark:text-white">Top Platform</p>
        <span className="font-[500px] text-sm text-[#34CAA5] cursor-pointer dark:hover:text-[#ff7438] hover:underline">See All</span>
      </div>

      <div className="flex flex-col overflow-auto h-[250px]"> 
        <ProgressBar name="Book Bazaar" progress={30} amount={'2,500,000'} color='#6160DC'/>
        <ProgressBar name="Artisan Alsle" progress={60} amount={'1,800,000'} color='#54C5EB'/>
        <ProgressBar name="Toy Troop" progress={50} amount={'1,300,000'} color='#FFB74A'/>
        <ProgressBar name="XStore" progress={85} amount={'5,456,000'} color='#FF4A55'/>
        <ProgressBar name="Ipheco Elegant" progress={95} amount={'5,500,000'} color='#34CAA5'/>
      </div>
    </div>
  );
};

export default Platforms;