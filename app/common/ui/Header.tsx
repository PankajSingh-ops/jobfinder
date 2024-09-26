"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  const router = useRouter();
  const { isLogin, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    router.push("/"); // Redirect to homepage or another route
  };

  const getProfileImage = () => {
    if (user?.gender === "male") return "/images/profile/boy5.png";
    if (user?.gender === "female") return "/images/profile/girl1.png";
    return "/images/profile/other.png"; // Default image for other gender
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/images/logo/jobfinder-high-resolution-logo-white-transparent.png"
          alt="Job Finder Logo"
          width={100}
          height={50}
          onClick={() => router.push("/")}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <ul>
          {!isLogin ? (
            <>
              <li>
                <span className={styles.spanLink} onClick={() => router.push("/auth/login")}>Login</span>
              </li>
              <li>
                <span className={styles.spanLink} onClick={() => router.push("/auth/signup")}>Signup</span>
              </li>
            </>
          ) : (
            <>
            <ul className={styles.comapniesandjobUl}>
              <li>
                <span className={styles.spanLink}>Companies</span>
              </li>
              <li>
                <span className={styles.spanLink}>Jobs</span>
              </li>
            </ul>
              {/* Show profile image and dropdown only if not in mobile menu */}
              {!menuOpen && (
                <div className={styles.profileContainer} onClick={toggleDropdown}>
                  <Image
                    src={getProfileImage()}
                    alt="Profile Image"
                    width={60}
                    height={60}
                    className={styles.profileImage} // Round-shaped profile image styling
                  />
                </div>
              )}
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <ul>
                    <li onClick={()=>router.push('/profile')}>
                      <AccountCircleIcon className={styles.icon} />
                      <span className={styles.spanLink1}>Profile</span>
                    </li>
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
