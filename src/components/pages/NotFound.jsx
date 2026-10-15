import { Link } from "react-router-dom";

const NotFound = () => (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center min-h-[60vh]">
        <p className="text-4xl font-bold text-[#34CAA5]">404</p>
        <h2 className="text-xl font-semibold">Page not found</h2>
        <p className="text-sm text-[#737373] dark:text-slate-300 max-w-sm">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link to="/" className="mt-2 rounded-full bg-[#34CAA5] px-4 py-2 text-xs font-medium text-white hover:bg-[#2bb592]">
            Back to dashboard
        </Link>
    </div>
);

export default NotFound;
