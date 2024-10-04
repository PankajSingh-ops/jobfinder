"use client";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Home, Settings, HelpCircle, Users } from "lucide-react";
import Header from "@/app/common/ui/Header";
import HomePage from "../pagess/home/AdminHome";
import AllUsers from "../pagess/AllUsers";

const ComponentTwo = () => <div className="p-4">Component Two Content</div>;
const ComponentThree = () => <div className="p-4">Component Three Content</div>;

export default function DashboardPage() {
  const [selectedComponent, setSelectedComponent] = useState("home");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "home":
        return <HomePage />;
      case "users":
        return <AllUsers />;
      case "settings":
        return <ComponentTwo />;
      case "help":
        return <ComponentThree />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-full bg-gray-100">
        <Sidebar className="h-full">
          <div className="p-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <Menu>
            <MenuItem
              icon={<Home size={20} />}
              onClick={() => setSelectedComponent("home")}
              className={selectedComponent === "home" ? "bg-blue-100" : ""}
            >
              Home
            </MenuItem>
            <MenuItem
              icon={<Users size={20} />}
              onClick={() => setSelectedComponent("users")}
              className={selectedComponent === "users" ? "bg-blue-100" : ""}
            >
              All Users
            </MenuItem>
            <MenuItem
              icon={<Settings size={20} />}
              onClick={() => setSelectedComponent("settings")}
              className={selectedComponent === "settings" ? "bg-blue-100" : ""}
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={<HelpCircle size={20} />}
              onClick={() => setSelectedComponent("help")}
              className={selectedComponent === "help" ? "bg-blue-100" : ""}
            >
              Help
            </MenuItem>
          </Menu>
        </Sidebar>
        <main className="flex-1 p-4">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedComponent.charAt(0).toUpperCase() +
                  selectedComponent.slice(1)}
              </h1>
            </div>
          </header>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {renderComponent()}
          </div>
        </main>
      </div>
    </>
  );
}
