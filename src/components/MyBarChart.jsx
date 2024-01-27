import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { ArrowDown2 } from "iconsax-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const gradientBackgroundColor = [
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.81)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
    "rgba(52, 202, 165, 0.28)",
];

const data = {
    labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    datasets: [
        {
            data: [
                7.0, 20.0, 4.0, 30.0, 10.0, 45.0, 10.0, 22.0, 35.0, 5.0, 32.0,
                28.0,
            ],
            backgroundColor: gradientBackgroundColor,
            borderRadius: 20,
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: "#6B7280", // X-axis ticks color
            },
        },
        y: {
            beginAtZero: true,
            max: 50.0,
            ticks: {
                color: "#6B7280", // Y-axis ticks color
                stepSize: 10.0,
            },
        },
    },
};

const MyBarChart = () => {
    return (
        <div className=" overflow-hidden m-2 mt-1 lg:mt:0 bg-[#fff] dark:bg-slate-700 dark:text-white">
            <div className="p flex justify-between items-center">
                <h2 className="font-semibold text-sm text-[#26282C] dark:text-white">
                    Sales Trends
                </h2>
                <div className="flex justify-center items-center">
                    <h2 className="text-xs font-light mr-2">Sort by :</h2>
                    <div className="flex items-center gap-2 text-[#3A3F51] dark:text-white">
                        <div className="flex items-center justify-center gap-2 px-2 py-1 border rounded-full text-xs">
                            <div>Weekly</div>
                            <div className="hover:bg-[#34CAA5] p-1 rounded-full">
                                <ArrowDown2 size="14" color="#697689" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 h-[140px] sm:h-[180px] md:h-[220px] lg:h-[250px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default MyBarChart;
