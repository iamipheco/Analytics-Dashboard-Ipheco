import React from "react";

const ProgressBar = ({ name, progress, amount }) => {
  return (
    <div className="bg-white shadow rounded px-3  dark:bg-slate-700 dark:text-white">
      <h2 className="text-xs font-semibold mb-2">{name}</h2>
      <div className="relative w-full h-3 bg-gray-200 rounded-full  dark:bg-slate-300 dark:text-white">
        <div
          className="absolute top-0 left-0 bg-green-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
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
        <span className="font-[500px] text-sm text-[#34CAA5] hover:underline">See All</span>
      </div>

      <div className="flex flex-col overflow-y-auto h-[230px]"> 
        <ProgressBar name="Book Bazaar" progress={30} amount={'2,500,000'}/>
        <ProgressBar name="Artisan Alsle" progress={60} amount={'1,800,000'}/>
        <ProgressBar name="Toy Troop" progress={50} amount={'1,300,000'}/>
        <ProgressBar name="XStore" progress={85} amount={'5,456,000'}/>
        <ProgressBar name="Ipheco Elegant" progress={95} amount={'5,500,000'}/>
      </div>
    </div>
  );
};

export default Platforms;