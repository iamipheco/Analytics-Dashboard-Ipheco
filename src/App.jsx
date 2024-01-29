import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./components/pages/Dashboard";



const App = () => {
  return (
   
      <div>
        <Routes>
          <Route
            path="/"
            element={<MainLayout />}
          >
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
  );
};

export default App;
