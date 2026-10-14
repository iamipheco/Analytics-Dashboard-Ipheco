import MyBarChart from "../MyBarChart";
import LastOrdersTable from "../LastOrderTable";
import IncomeBox from "../IncomeBox";
import Platforms from "../Platforms";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="lg:col-span-3">
                <MyBarChart />
            </div>
            <div className="lg:col-span-2">
                <IncomeBox />
            </div>
            <div className="lg:col-span-3">
                <LastOrdersTable />
            </div>
            <div className="lg:col-span-2">
                <Platforms />
            </div>
            <footer className="lg:col-span-5 py-2 text-center text-xs text-[#A3A3A3]">
                © {new Date().getFullYear()} FASTA. All rights reserved.
            </footer>
        </div>
    );
};

export default Dashboard;
