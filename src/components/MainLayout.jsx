import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Modal, { Button } from "./Modal";
import { useApp } from "../context/AppContext";

const MainLayout = () => {
    const { isDarkMode, logoutRequested, cancelLogout } = useApp();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Close the mobile drawer whenever the route changes.
    useEffect(() => setMobileOpen(false), [location.pathname]);

    const confirmLogout = () => {
        cancelLogout();
        toast.success("You have been signed out.");
    };

    return (
        <section className="flex h-screen h-[100dvh] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

            <div className="flex flex-col flex-1 min-w-0">
                <Header onOpenMenu={() => setMobileOpen(true)} />
                <main className="no-scrollbar flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-5">
                    <Outlet />
                </main>
            </div>

            <Modal
                open={logoutRequested}
                onClose={cancelLogout}
                title="Sign out?"
                footer={
                    <>
                        <Button variant="ghost" onClick={cancelLogout}>Cancel</Button>
                        <Button variant="danger" onClick={confirmLogout}>Sign out</Button>
                    </>
                }
            >
                <p className="text-[#737373] dark:text-slate-300">
                    You&apos;ll need to sign in again to access your dashboard.
                </p>
            </Modal>

            <ToastContainer position="bottom-right" autoClose={2500} theme={isDarkMode ? "dark" : "light"} />
        </section>
    );
};

export default MainLayout;
