import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeSlash, InfoCircle, Lock1, Sms, TickCircle } from "iconsax-react";
import ImgLogo from "../../assets/img/logo.png";
import { accounts } from "../../data/accounts";
import { useApp } from "../../context/AppContext";
import DarkModeToggle from "../DarkModeToggle";

const HIGHLIGHTS = ["Live sales and income at a glance", "Orders, products and customers in one place", "Works on any device, light or dark"];

const inputWrap =
    "flex items-center gap-2 rounded-xl border bg-white px-3 transition focus-within:border-[#34CAA5] focus-within:ring-2 focus-within:ring-[#34CAA5]/20 dark:bg-slate-800";

const Login = () => {
    const { session, signIn } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Send people back to the page they were trying to open.
    const from = location.state?.from?.pathname ?? "/";

    if (session) return <Navigate to={from} replace />;

    const submit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            setError("Enter your email and password.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const user = await signIn(email, password, remember);
            toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
        setError("");
    };

    return (
        <div className="flex min-h-[100dvh] bg-[#FAFAFA] dark:bg-slate-800">
            <aside className="relative hidden w-[44%] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0F766E] to-[#34CAA5] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
                <div aria-hidden="true" className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />
                <div className="relative flex items-center gap-3">
                    <img src={ImgLogo} alt="" className="w-9" />
                    <span className="text-2xl font-bold">FASTA</span>
                </div>
                <div className="relative">
                    <h2 className="max-w-md text-3xl font-semibold leading-tight">Everything your store needs, on one dashboard.</h2>
                    <ul className="mt-6 space-y-3 text-sm text-white/85">
                        {HIGHLIGHTS.map((h) => (
                            <li key={h} className="flex items-center gap-2">
                                <TickCircle size="18" color="currentColor" variant="Bold" /> {h}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="relative text-xs text-white/60">© {new Date().getFullYear()} FASTA. All rights reserved.</p>
            </aside>

            <main className="flex flex-1 flex-col px-4 py-6 sm:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:invisible">
                        <img src={ImgLogo} alt="" className="w-8" />
                        <span className="text-xl font-bold">FASTA</span>
                    </div>
                    <DarkModeToggle />
                </div>

                <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
                    <h1 className="text-2xl font-semibold">Sign in</h1>
                    <p className="mt-1 text-sm text-[#737373] dark:text-slate-300">Welcome back. Sign in to see your dashboard.</p>

                    <form onSubmit={submit} noValidate className="mt-6 space-y-4">
                        {error && (
                            <p role="alert" className="flex items-start gap-2 rounded-xl bg-[#ED544E]/10 px-3 py-2.5 text-sm text-[#ED544E] dark:text-red-300">
                                <InfoCircle size="18" color="currentColor" className="mt-px shrink-0" /> {error}
                            </p>
                        )}

                        <label className="block">
                            <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">Email</span>
                            <span className={`${inputWrap} ${error ? "border-[#ED544E]/60" : "border-[#DADDDD] dark:border-slate-500"}`}>
                                <Sms size="18" color="#A3A3A3" />
                                <input
                                    type="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[#A3A3A3]"
                                />
                            </span>
                        </label>

                        <label className="block">
                            <span className="mb-1 flex items-center justify-between text-xs font-medium text-[#525252] dark:text-slate-300">
                                Password
                                <button
                                    type="button"
                                    onClick={() => toast.info("Password reset isn't available in the demo. Use a demo account below.")}
                                    className="font-medium text-[#34CAA5] hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </span>
                            <span className={`${inputWrap} ${error ? "border-[#ED544E]/60" : "border-[#DADDDD] dark:border-slate-500"}`}>
                                <Lock1 size="18" color="#A3A3A3" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[#A3A3A3]"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="text-[#A3A3A3] hover:text-[#34CAA5]"
                                >
                                    {showPassword ? <EyeSlash size="18" color="currentColor" /> : <Eye size="18" color="currentColor" />}
                                </button>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#525252] dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded accent-[#34CAA5]"
                            />
                            Keep me signed in
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#34CAA5] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2bb592] disabled:opacity-70"
                        >
                            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-8 rounded-xl border border-dashed border-[#DADDDD] p-4 dark:border-slate-500">
                        <p className="text-xs font-semibold">Demo accounts</p>
                        <ul className="mt-2 space-y-2">
                            {accounts.map((a) => (
                                <li key={a.email} className="flex items-center justify-between gap-2 text-xs">
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium">
                                            {a.name} <span className="font-normal text-[#A3A3A3]">· {a.role}</span>
                                        </span>
                                        <span className="block truncate text-[#737373] dark:text-slate-300">
                                            {a.email} / {a.password}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo(a)}
                                        className="shrink-0 rounded-full border border-[#DADDDD] px-3 py-1 font-medium hover:border-[#34CAA5] hover:text-[#34CAA5] dark:border-slate-500"
                                    >
                                        Use
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
