import React from "react";
import { DocumentText } from "iconsax-react";
import userImage1 from "../assets/img/user1.png";
import userImage2 from "../assets/img/user2.png";
import userImage3 from "../assets/img/user3.png";
import userImage4 from "../assets/img/user4.png";
import userImage5 from "../assets/img/user5.png";

const lastOrdersData = [
  {
    name: "Marcus Bergson",
    date: "Nov 15, 2023",
    amount: "$80,000",
    status: "Paid",
    invoice: "View",
    userImage: userImage1,
  },
  {
    name: "Jaydon Vaccaro",
    date: "Nov 15, 2023",
    amount: "$150,000",
    status: "Refund",
    invoice: "View",
    userImage: userImage2,
  },
  {
    name: "Corey Schleifer",
    date: "Nov 14, 2023",
    amount: "$87,000",
    status: "Paid",
    invoice: "View",
    userImage: userImage3,
  },
  {
    name: "Cooper Press",
    date: "Nov 14, 2023",
    amount: "$100,000",
    status: "Refund",
    invoice: "View",
    userImage: userImage4,
  },
  {
    name: "Phillip Lubin",
    date: "Nov 13, 2023",
    amount: "$78,000",
    status: "Paid",
    invoice: "View",
    userImage: userImage5,
  },
];
{/* <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 overflow-y-auto transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}> */}

const LastOrdersTable = () => (
  <div className="w-full bg-white rounded-xl shadow p-2  dark:bg-slate-700 ">
      <div className="flex justify-between px-3 p-2">
        <p className="font-semibold text-sm mb-3 text-[#26282C] dark:text-white ">Last Orders</p>
        <span className="font-[500px] text-sm text-[#34CAA5] hover:underline">See All</span>
      </div>
<div className="overflow-x-auto overflow-y-hidden h-[250px]">
    <table className="w-full text-left text-xs ">
      <thead className="text-xs text-[#737373] dark:text-white">
        <tr>
          <th scope="col" className="pl-6 px-3 py-3">
            Name
          </th>
          <th scope="col" className="pl-4 px-3 py-3">
            Date
          </th>
          <th scope="col" className="pl-4 px-3 py-3">
            Amount
          </th>
          <th scope="col" className="pl-4 px-3 py-3">
            Status
          </th>
          <th scope="col" className="pl-6 px-3 py-3">
            Invoice
          </th>
        </tr>
      </thead>
      <tbody className="">
        {lastOrdersData.map((order, index) => (
          <tr key={index} className={index % 2 === 0 ? "dark:text-slate-700" : "dark:bg-slate-600 "}>
            <td className="  sm:px-3 sm:py-1 border-b-[1px] dark:border-slate-500 dark:text-white">
              <span className="flex items-center">
                <img
                  src={order.userImage}
                  alt={`${order.name}'s user`}
                  className="rounded-full h-8 w-8 mx-2 mr-4  "
                />{" "}
                {order.name}
              </span>
            </td>
            <td className=" sm:px-4 smpy-2 border-b-[1px] dark:border-slate-500 sm:text-[#737373] dark:text-slate-100">
              {order.date}
            </td>
            <td className="px-4 py-2 border-b-[1px] dark:border-slate-500 font-[500px] text-[#0D062D] dark:font-medium dark:text-emerald-400 ">
              {order.amount}
            </td>
            <td
              className={`px-4 py-2 border-b-[1px] dark:border-slate-500 ${
                order.status === "Paid" ? "text-green-500 dark:font-medium dark:text-emerald-500" : "text-red-500 dark:font-medium dark:text-red-300"
              }`}
            >
              {order.status}
            </td>
            <td className="px-4 py-2 border-b-[1px] dark:border-slate-500">
              <span className="flex items-center dark:hover:text-emerald-500 dark:text-slate-300 dark:hover:underline">
                <DocumentText
                  size="16"
                  color="#697689"
                  variant="Broken"
                  className="mr-2"
                />{" "}
                {order.invoice}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
);

export default LastOrdersTable;
