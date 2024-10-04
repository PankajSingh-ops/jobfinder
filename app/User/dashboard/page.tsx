"use client";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Home,
  Settings,
  HelpCircle,
  Users,
  Heart,
  FileCheck,
  Brain,
} from "lucide-react";
import Header from "@/app/common/ui/Header";
import UserHome from "../pagess/UserHome";
import AppliedJobs from "../pagess/AppliedJobs";
import LikedJobs from "../pagess/LikedJobs";
import JobStatus from "../pagess/JobStatus";
import RecommendedJobs from "../pagess/RecommendedJobs";
import { useMediaQuery } from "@mui/material";

const ComponentOne = () => (
  <div className="p-4">Component Two Content User</div>
);
const ComponentTwo = () => <div className="p-4">Component Two Content</div>;
const ComponentThree = () => <div className="p-4">Component Three Content</div>;

export default function UserDashboardPage() {
  const [selectedComponent, setSelectedComponent] = useState("home");
  const isMobile = useMediaQuery("(max-width:780px)");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "home":
        return <UserHome />;
      case "applied jobs":
        return <AppliedJobs />;
      case "liked jobs":
        return <LikedJobs />;
      case "job status":
        return <JobStatus />;
      case "job status":
        return <RecommendedJobs />;
      case "settings":
        return <ComponentTwo />;
      case "help":
        return <ComponentThree />;
      default:
        return <ComponentOne />;
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-full bg-gray-100">
        <Sidebar className="h-full" style={{ maxWidth:isMobile?"70px":"", width:isMobile?"70px":"", minWidth:isMobile?"40px":"" }}>
          <div className="p-4">
            {!isMobile && <h1 className="text-xl font-bold">Dashboard</h1>}
          </div>
          <Menu>
            <MenuItem
              icon={<Home size={20} />}
              onClick={() => setSelectedComponent("home")}
              className={selectedComponent === "home" ? "bg-blue-100" : ""}
            >
              {" "}
              {!isMobile && "Home"}
            </MenuItem>
            <MenuItem
              icon={<Users size={20} />}
              onClick={() => setSelectedComponent("applied jobs")}
              className={
                selectedComponent === "applied jobs" ? "bg-blue-100" : ""
              }
            >
              {!isMobile && "Applied Jobs"}
            </MenuItem>
            <MenuItem
              icon={<Heart size={20} />}
              onClick={() => setSelectedComponent("liked jobs")}
              className={
                selectedComponent === "liked jobs" ? "bg-blue-100" : ""
              }
            >
              {!isMobile && "Liked Jobs"}
            </MenuItem>
            <MenuItem
              icon={<FileCheck size={20} />}
              onClick={() => setSelectedComponent("job status")}
              className={
                selectedComponent === "job status" ? "bg-blue-100" : ""
              }
            >
              {!isMobile && "Job Status"}
            </MenuItem>
            <MenuItem
              icon={<Brain size={20} />}
              onClick={() => setSelectedComponent("recommended jobs")}
              className={
                selectedComponent === "recommended jobs" ? "bg-blue-100" : ""
              }
            >
              {!isMobile && "Recommended Jobs"}
            </MenuItem>
            <MenuItem
              icon={<Settings size={20} />}
              onClick={() => setSelectedComponent("settings")}
              className={selectedComponent === "settings" ? "bg-blue-100" : ""}
            >
              {!isMobile && "Settings"}
            </MenuItem>
            <MenuItem
              icon={<HelpCircle size={20} />}
              onClick={() => setSelectedComponent("help")}
              className={selectedComponent === "help" ? "bg-blue-100" : ""}
            >
              {!isMobile && "Help"}
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
