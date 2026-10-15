import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./components/MainLayout";
import RequireAuth from "./components/RequireAuth";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Analytics from "./components/pages/Analytics";
import Products from "./components/pages/Products";
import Users from "./components/pages/Users";
import Settings from "./components/pages/Settings";
import Messages from "./components/pages/Messages";
import Support from "./components/pages/Support";
import Billing from "./components/pages/Billing";
import Tips from "./components/pages/Tips";
import NotFound from "./components/pages/NotFound";
import { useApp } from "./context/AppContext";

const App = () => {
    const { isDarkMode } = useApp();
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <MainLayout />
                        </RequireAuth>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="products" element={<Products />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="support" element={<Support />} />
                    <Route path="tips" element={<Tips />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
            {/* Lives outside the layout so the login page can show toasts too. */}
            <ToastContainer position="bottom-right" autoClose={2500} theme={isDarkMode ? "dark" : "light"} />
        </>
    );
};

export default App;
