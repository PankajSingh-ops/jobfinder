"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material"; // Import useMediaQuery
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { NextWeek, ViewList } from "@mui/icons-material";
import { fetchProfileData } from "@/store/slices/profileSlice";
import MobileHeader from "./MobileHeader"; // Import the MobileHeader component

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)"); // Use media query to detect mobile view
  const router = useRouter();
  const { isLogin, user } = useSelector((state: RootState) => state.auth);
  const { profilePic } = useSelector((state: RootState) => state.profile);

  const dispatch: AppDispatch = useDispatch();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const getProfileImage = () => {
    if (profilePic) {
      return profilePic;
    }
    if (user?.gender === "male") {
      return "/images/profile/boy5.png";
    }
    if (user?.gender === "female") {
      return "/images/profile/girl1.png";
    }
    if (user?.gender === "other") {
      return "/images/profile/girl2.png";
    }
    return "/images/profile/default.png";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await dispatch(fetchProfileData()).unwrap();
        console.log(profileData);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  // If on mobile, render the MobileHeader component
  if (isMobile) {
    return <MobileHeader />;
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/images/logo/jobfinder-high-resolution-logo-white-transparent.png"
          alt="Job Finder Logo"
          width={100}
          height={50}
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <ul>
          {!isLogin ? (
            <>
              <li>
                <span
                  className={styles.spanLink}
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </span>
              </li>
              <li>
                <span
                  className={styles.spanLink}
                  onClick={() => router.push("/auth/signup")}
                >
                  Signup
                </span>
              </li>
            </>
          ) : (
            <>
              <ul className={styles.comapniesandjobUl}>
                <li onClick={() => router.push("/company")}>
                  <span className={styles.spanLink}>Companies</span>
                </li>
                <li onClick={() => router.push("/jobs")}>
                  <span className={styles.spanLink}>Jobs</span>
                </li>
              </ul>
              {!menuOpen && (
                <div
                  className={styles.profileContainer}
                  onClick={toggleDropdown}
                >
                  <Image
                    src={getProfileImage()}
                    alt="Profile Image"
                    width={60}
                    height={60}
                    className={styles.profileImage}
                  />
                </div>
              )}
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <ul>
                    <li onClick={() => router.push("/profile")}>
                      <AccountCircleIcon className={styles.icon} />
                      <span className={styles.spanLink1}>Profile</span>
                    </li>
                    {isLogin && user?.userType === "employer" && (
                      <>
                        <li onClick={() => router.push("/company/add-company")}>
                          <NextWeek className={styles.icon} />
                          <span className={styles.spanLink1}>My Company</span>
                        </li>
                        <li onClick={() => router.push("/employer/add-jobs")}>
                          <NextWeek className={styles.icon} />
                          <span className={styles.spanLink1}>Add Job</span>
                        </li>
                        <li onClick={() => router.push("/employer/view-jobs")}>
                          <ViewList className={styles.icon} />
                          <span className={styles.spanLink1}>View Job</span>
                        </li>
                      </>
                    )}
                    <li onClick={handleLogout}>
                      <LogoutIcon className={styles.icon} />
                      <span className={styles.spanLink1}>Signout</span>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </ul>
      </nav>

      <div className={styles.burger} onClick={toggleMenu}>
        <div className={`${styles.line} ${menuOpen ? styles.line1 : ""}`}></div>
        <div className={`${styles.line} ${menuOpen ? styles.line2 : ""}`}></div>
        <div className={`${styles.line} ${menuOpen ? styles.line3 : ""}`}></div>
      </div>
    </header>
  );
}
