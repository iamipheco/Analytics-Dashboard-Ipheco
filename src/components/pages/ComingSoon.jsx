import { Link } from "react-router-dom";

const ComingSoon = ({ title }) => (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center min-h-[60vh]">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-[#737373] dark:text-slate-300 max-w-sm">
            This section is on the way. In the meantime, everything you need is on the dashboard.
        </p>
        <Link to="/" className="mt-2 rounded-full bg-[#34CAA5] px-4 py-2 text-xs font-medium text-white hover:bg-[#2bb592]">
            Back to dashboard
        </Link>
    </div>
);

export default ComingSoon;
