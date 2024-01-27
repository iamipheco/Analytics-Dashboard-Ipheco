// Dashboard.js
import React from "react";
import MyBarChart from "../MyBarChart";
import LastOrdersTable from "../LastOrderTable";
import IncomeBox from "../IncomeBox";
import Platforms from "../Platforms";

const Dashboard = () => {
  return (
    <div className="grid p-3 grid-cols-3 lg:grid-cols-5 lg:grid-rows-2 gap-4 lg:h-screen">
      {/* grid 1 */}
      <div className="col-span-3 lg:col-span-3 lg:row-span-1 p-3 pt-2 lg:pt-4 rounded-xl shadow bg-[#fff] dark:bg-slate-700 dark:text-white">
        <MyBarChart />
      </div>
      {/* grid 2 */}
      <div className="col-span-3 sm:col-span-3 lg:col-span-2 lg:row-span-1 ">
        <IncomeBox />
      </div>
      {/* grid 3 */}
      <div className="col-span-3 lg:col-span-3 lg:row-span-1 ">
        <LastOrdersTable />
      </div>
      {/* grid 4 */}
      <div className="col-span-3">
        <Platforms />
      </div>
    </div>
  );
};

export default Dashboard;
