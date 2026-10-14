import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./components/pages/Dashboard";
import Analytics from "./components/pages/Analytics";
import ComingSoon from "./components/pages/ComingSoon";
import { sideData } from "./components/Data";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                {sideData
                    .filter((item) => item.link && !["/", "/analytics"].includes(item.link))
                    .map((item) => (
                        <Route key={item.link} path={item.link.slice(1)} element={<ComingSoon title={item.name} />} />
                    ))}
                <Route path="*" element={<ComingSoon title="Page not found" />} />
            </Route>
        </Routes>
    );
};

export default App;
