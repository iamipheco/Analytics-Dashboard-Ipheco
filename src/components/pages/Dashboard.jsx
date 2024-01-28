// Dashboard.js
import React from "react";
import MyBarChart from "../MyBarChart";
import LastOrdersTable from "../LastOrderTable";
import IncomeBox from "../IncomeBox";
import Platforms from "../Platforms";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 lg:h-[220px]">
      {/* grid 1 */}
      <div className="col-span-3 lg:col-span-3 p-3 pt-2 lg:p rounded-xl shadow bg-[#fff] dark:bg-slate-700 dark:text-white ">
        <MyBarChart />
      </div>
      {/* grid 2 */}
      <div className="col-span-3 sm:col-span-3 lg:col-span-2 ">
        <IncomeBox />
      </div>
      {/* grid 3 */}
      <div className="col-span-3 lg:col-span-3 ">
        <LastOrdersTable />
      </div>
      {/* grid 4 */}
      <div className="col-span-3 lg:col-span-2 h-[270px]">
        <Platforms />
      </div>
    </div>
  );
};

export default Dashboard;
