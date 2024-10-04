import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./MobileHeader.module.css"; // Create separate CSS module for mobile header

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isLogin, user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className={styles.mobileHeader}>
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

      <div className={styles.burger} onClick={toggleMenu}>
        {menuOpen ? (
          <CloseIcon />
        ) : (
          <div className={styles.burger} onClick={toggleMenu}>
            <div
              className={`${styles.line} ${menuOpen ? styles.line1 : ""}`}
            ></div>
            <div
              className={`${styles.line} ${menuOpen ? styles.line2 : ""}`}
            ></div>
            <div
              className={`${styles.line} ${menuOpen ? styles.line3 : ""}`}
            ></div>
          </div>
        )}
      </div>

      {menuOpen && (
        <nav className={styles.nav}>
          <ul>
            {!isLogin ? (
              <>
                <li onClick={() => router.push("/auth/login")}>Login</li>
                <li onClick={() => router.push("/auth/signup")}>Signup</li>
              </>
            ) : (
              <>
                <li onClick={() => router.push("/profile")}>Profile</li>
                <li onClick={() => router.push("/company")}>
                  <span className={styles.spanLink}>Companies</span>
                </li>
                <li onClick={() => router.push("/jobs")}>
                  <span className={styles.spanLink}>Jobs</span>
                </li>
                {isLogin && user?.userType === "jobseeker" && (
                  <>
                    <li onClick={() => router.push("/User/dashboard")}>
                      <span className={styles.spanLink1}>Dashboard</span>
                    </li>
                  </>
                )}
                {user?.userType === "employer" && (
                  <>
                    <li onClick={() => router.push("/company/add-company")}>
                      My Company
                    </li>
                    <li onClick={() => router.push("/employer/add-jobs")}>
                      Add Job
                    </li>
                    <li onClick={() => router.push("/employer/view-jobs")}>
                      View Job
                    </li>
                  </>
                )}
                <li onClick={handleLogout}>Signout</li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
