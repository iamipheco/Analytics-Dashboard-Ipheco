import React from 'react'
import {BoxTick, Coin1, I3DRotate, ShoppingCart } from "iconsax-react";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";

const IncomeBox= () => {
  return (
    <div className="grid sm:grid-cols-2 sm-max:grid-cols-3 gap-4 ">
                    {/* first box 1 */}
                    <div className="flex flex-col gap-2 bg-[#FFFFFF] px-5 p-5 rounded-lg shadow   dark:bg-slate-700 dark:text-white">
                        <div className="flex justify-between items-center">
                            <div className="border rounded-full p-2">
                                <BoxTick
                                    size="24"
                                    color="#37d67a"
                                    variant="Bulk"
                                />
                            </div>
                            <svg
                                width="106"
                                height="33"
                                viewBox="0 0 106 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M102.994 8.46666H105V33L1 33V11.4536L4.00877 18.9203L5.20413 21.9069H6.60551L9.40827 18.9203L11.3702 21.907L17.256 21.9072L20.339 18.9204L22.0207 14.4396L24.4683 16.6803L26.6747 18.9203L27.3638 22.3333L28.7651 21.9069H30.4858L33.6952 11.4536L34.6981 14.4403L36.3028 11.4536L37.5063 16.6803L40.7156 7.72028L42.5209 11.4536H45.9308L49.5413 3.98696L51.7477 7.72028L54.6535 5.48L58.194 11.4533L60.4704 1L62.1179 11.4533L73.1072 15.9333L74.5113 12.9466H75.9153L79.1247 8.46666H82.334L83.5375 12.9466L88.3515 3.98666L90.3574 15.9333L91.3603 11.4533H93.5667L95.5726 1L97.5784 9.95999L98.5813 5.48H101.189L102.994 8.46666Z"
                                    fill="url(#paint0_linear_2132_4599)"
                                    fill-opacity="0.16"
                                />
                                <path
                                    d="M105 8.4667H102.994L101.189 5.48004H98.5813L97.5784 9.96003L95.5726 1.00004L93.5667 11.4534H91.3603L90.3574 15.9333L88.3515 3.9867L83.5375 12.9467L82.334 8.4667H79.1247L75.9153 12.9467H74.5113L73.1072 15.9333L62.1179 11.4534L60.4704 1.00004L58.194 11.4534L54.6535 5.48004L51.7477 7.72032L49.5413 3.987L45.9308 11.4536H42.5209L40.7156 7.72032L37.5063 16.6803L36.3028 11.4536L34.6981 14.4403L33.6952 11.4536L30.4858 21.907H28.7651L27.3638 22.3334L26.6747 18.9203L24.4683 16.6803L22.0206 14.4396L20.339 18.9204L17.256 21.9073L11.3702 21.907L9.40827 18.9203L6.60551 21.907H5.20414L4.00877 18.9203L1 11.4536"
                                    stroke="#66C87B"
                                    stroke-linecap="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_2132_4599"
                                        x1="53"
                                        y1="33"
                                        x2="53"
                                        y2="1"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop
                                            stop-color="#77B900"
                                            stop-opacity="0"
                                        />
                                        <stop
                                            offset="0.809892"
                                            stop-color="#77B900"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="text-[#898989]">
                                Total Order
                            </h3>
                            <span className="font-semibold text-2xl">350</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-1 p-1 px-2 rounded-full bg-[#34CAA5] bg-opacity-10">
                                <div className="">
                                    <IoTrendingUp className="text-xs text-green-500" />
                                </div>
                                <p className="text-xs  text-green-500">23.5%</p>
                            </div>
                            <p className="text-xs">vs. previous month</p>
                        </div>
                    </div>
                    {/* second box 2 */}
                    <div className="flex flex-col gap-2 bg-[#FFFFFF] px-5  p-2  rounded-lg shadow  dark:bg-slate-700 dark:text-white">
                        <div className="flex justify-between items-center">
                            <div className="border rounded-full p-2">
                                <I3DRotate
                                    size="24"
                                    color="#37d67a"
                                    variant="Bulk"
                                />
                            </div>
                            <svg
                                width="106"
                                height="33"
                                viewBox="0 0 106 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3.00584 8.46666H1L1 33L105 33V11.4536L101.991 18.9203L100.796 21.9069H99.3945L96.5917 18.9203L94.6298 21.907L88.744 21.9072L85.661 18.9204L83.9793 14.4396L81.5317 16.6803L79.3253 18.9203L78.6362 22.3333L77.2349 21.9069H75.5142L72.3048 11.4536L71.3019 14.4403L69.6972 11.4536L68.4937 16.6803L65.2844 7.72028L63.4791 11.4536H60.0692L56.4587 3.98696L54.2523 7.72028L51.3465 5.48L47.806 11.4533L45.5296 1L43.8821 11.4533L32.8928 15.9333L31.4887 12.9466H30.0847L26.8753 8.46666H23.666L22.4625 12.9466L17.6485 3.98666L15.6426 15.9333L14.6397 11.4533H12.4333L10.4274 1L8.4216 9.95999L7.41868 5.48H4.81109L3.00584 8.46666Z"
                                    fill="url(#paint0_linear_2133_4687)"
                                    fill-opacity="0.16"
                                />
                                <path
                                    d="M1 8.4667H3.00584L4.81109 5.48004H7.41868L8.4216 9.96003L10.4274 1.00004L12.4333 11.4534H14.6397L15.6426 15.9333L17.6485 3.9867L22.4625 12.9467L23.666 8.4667H26.8753L30.0847 12.9467H31.4887L32.8928 15.9333L43.8821 11.4534L45.5296 1.00004L47.806 11.4534L51.3465 5.48004L54.2523 7.72032L56.4587 3.987L60.0692 11.4536H63.4791L65.2844 7.72032L68.4937 16.6803L69.6972 11.4536L71.3019 14.4403L72.3048 11.4536L75.5142 21.907H77.2349L78.6362 22.3334L79.3253 18.9203L81.5317 16.6803L83.9794 14.4396L85.661 18.9204L88.744 21.9073L94.6298 21.907L96.5917 18.9203L99.3945 21.907H100.796L101.991 18.9203L105 11.4536"
                                    stroke="#ED544E"
                                    stroke-linecap="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_2133_4687"
                                        x1="53"
                                        y1="33"
                                        x2="53"
                                        y2="1"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop
                                            stop-color="#ED544E"
                                            stop-opacity="0"
                                        />
                                        <stop
                                            offset="0.809892"
                                            stop-color="#ED544E"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="text-[#898989]">
                                Total Refund
                            </h3>
                            <span className="font-semibold text-2xl">270</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-1 p-1 px-2 rounded-full bg-[#ED544E] bg-opacity-10">
                                <div className="">
                                    <IoTrendingDown className="text-xs text-red-500" />
                                </div>
                                <p className="text-xs  text-red-500">23.5%</p>
                            </div>
                            <p className="text-xs">vs. previous month</p>
                        </div>
                    </div>
                    {/* Third box 3 */}
                    <div className="flex flex-col gap-2 bg-[#FFFFFF] px-5  p-3 rounded-lg shadow   dark:bg-slate-700 dark:text-white">
                        <div className="flex justify-between items-center">
                            <div className="border rounded-full p-2">
                                <ShoppingCart
                                    size="24"
                                    color="#37d67a"
                                    variant="Bulk"
                                />
                            </div>
                            <svg
                                width="106"
                                height="33"
                                viewBox="0 0 106 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3.00584 8.46666H1L1 33L105 33V11.4536L101.991 18.9203L100.796 21.9069H99.3945L96.5917 18.9203L94.6298 21.907L88.744 21.9072L85.661 18.9204L83.9793 14.4396L81.5317 16.6803L79.3253 18.9203L78.6362 22.3333L77.2349 21.9069H75.5142L72.3048 11.4536L71.3019 14.4403L69.6972 11.4536L68.4937 16.6803L65.2844 7.72028L63.4791 11.4536H60.0692L56.4587 3.98696L54.2523 7.72028L51.3465 5.48L47.806 11.4533L45.5296 1L43.8821 11.4533L32.8928 15.9333L31.4887 12.9466H30.0847L26.8753 8.46666H23.666L22.4625 12.9466L17.6485 3.98666L15.6426 15.9333L14.6397 11.4533H12.4333L10.4274 1L8.4216 9.95999L7.41868 5.48H4.81109L3.00584 8.46666Z"
                                    fill="url(#paint0_linear_2133_4687)"
                                    fill-opacity="0.16"
                                />
                                <path
                                    d="M1 8.4667H3.00584L4.81109 5.48004H7.41868L8.4216 9.96003L10.4274 1.00004L12.4333 11.4534H14.6397L15.6426 15.9333L17.6485 3.9867L22.4625 12.9467L23.666 8.4667H26.8753L30.0847 12.9467H31.4887L32.8928 15.9333L43.8821 11.4534L45.5296 1.00004L47.806 11.4534L51.3465 5.48004L54.2523 7.72032L56.4587 3.987L60.0692 11.4536H63.4791L65.2844 7.72032L68.4937 16.6803L69.6972 11.4536L71.3019 14.4403L72.3048 11.4536L75.5142 21.907H77.2349L78.6362 22.3334L79.3253 18.9203L81.5317 16.6803L83.9794 14.4396L85.661 18.9204L88.744 21.9073L94.6298 21.907L96.5917 18.9203L99.3945 21.907H100.796L101.991 18.9203L105 11.4536"
                                    stroke="#ED544E"
                                    stroke-linecap="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_2133_4687"
                                        x1="53"
                                        y1="33"
                                        x2="53"
                                        y2="1"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop
                                            stop-color="#ED544E"
                                            stop-opacity="0"
                                        />
                                        <stop
                                            offset="0.809892"
                                            stop-color="#ED544E"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="text-[#898989] ">
                                Average Sales
                            </h3>
                            <span className="font-semibold text-2xl">1567</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-1 p-1 px-2 rounded-full bg-[#ED544E] bg-opacity-10">
                                <div className="">
                                    <IoTrendingDown className="text-xs text-red-500" />
                                </div>
                                <p className="text-xs  text-red-500">23.5%</p>
                            </div>
                            <p className="text-xs">vs. previous month</p>
                        </div>
                    </div>
                    {/* Fourth box 4 */}
                    <div className="flex flex-col gap-2 bg-[#FFFFFF] px-5  p-3 rounded-lg  shadow  dark:bg-slate-700 dark:text-white">
                        <div className="flex justify-between items-center">
                            <div className="border rounded-full p-2">
                                <Coin1
                                    size="24"
                                    color="#37d67a"
                                    variant="Bulk"
                                />
                            </div>
                            <svg
                                width="106"
                                height="33"
                                viewBox="0 0 106 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M102.994 8.46666H105V33L1 33V11.4536L4.00877 18.9203L5.20413 21.9069H6.60551L9.40827 18.9203L11.3702 21.907L17.256 21.9072L20.339 18.9204L22.0207 14.4396L24.4683 16.6803L26.6747 18.9203L27.3638 22.3333L28.7651 21.9069H30.4858L33.6952 11.4536L34.6981 14.4403L36.3028 11.4536L37.5063 16.6803L40.7156 7.72028L42.5209 11.4536H45.9308L49.5413 3.98696L51.7477 7.72028L54.6535 5.48L58.194 11.4533L60.4704 1L62.1179 11.4533L73.1072 15.9333L74.5113 12.9466H75.9153L79.1247 8.46666H82.334L83.5375 12.9466L88.3515 3.98666L90.3574 15.9333L91.3603 11.4533H93.5667L95.5726 1L97.5784 9.95999L98.5813 5.48H101.189L102.994 8.46666Z"
                                    fill="url(#paint0_linear_2132_4599)"
                                    fill-opacity="0.16"
                                />
                                <path
                                    d="M105 8.4667H102.994L101.189 5.48004H98.5813L97.5784 9.96003L95.5726 1.00004L93.5667 11.4534H91.3603L90.3574 15.9333L88.3515 3.9867L83.5375 12.9467L82.334 8.4667H79.1247L75.9153 12.9467H74.5113L73.1072 15.9333L62.1179 11.4534L60.4704 1.00004L58.194 11.4534L54.6535 5.48004L51.7477 7.72032L49.5413 3.987L45.9308 11.4536H42.5209L40.7156 7.72032L37.5063 16.6803L36.3028 11.4536L34.6981 14.4403L33.6952 11.4536L30.4858 21.907H28.7651L27.3638 22.3334L26.6747 18.9203L24.4683 16.6803L22.0206 14.4396L20.339 18.9204L17.256 21.9073L11.3702 21.907L9.40827 18.9203L6.60551 21.907H5.20414L4.00877 18.9203L1 11.4536"
                                    stroke="#66C87B"
                                    stroke-linecap="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_2132_4599"
                                        x1="53"
                                        y1="33"
                                        x2="53"
                                        y2="1"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop
                                            stop-color="#77B900"
                                            stop-opacity="0"
                                        />
                                        <stop
                                            offset="0.809892"
                                            stop-color="#77B900"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="text-[#898989]">
                                Total Income
                            </h3>
                            <span className="font-semibold text-2xl">350.000</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-1 p-1 px-2 rounded-full bg-[#34CAA5] bg-opacity-10">
                                <div className="">
                                    <IoTrendingUp className="text-xs text-green-500" />
                                </div>
                                <p className="text-xs  text-green-500">23.5%</p>
                            </div>
                            <p className="text-xs">vs. previous month</p>
                        </div>
                    </div>
                </div>
  )
}

export default IncomeBox