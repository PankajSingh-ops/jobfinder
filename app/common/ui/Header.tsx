"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isLogin } = useSelector((state: RootState) => state.auth);
  const dispatch=useDispatch()


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    router.push("/"); // Redirect to homepage or another route
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/images/logo/jobfinder-high-resolution-logo-white-transparent.png"
          alt="Job Finder Logo"
          width={100}
          height={50}
          onClick={()=>router.push("/")}
          style={{ cursor:'pointer' }}
        />
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <ul>
          {!isLogin?(<>
          <li>
            {/* Use a span or button instead of <a> */}
            <span className={styles.spanLink} onClick={() => router.push("/auth/login")}>Login</span>
          </li>
          <li>
            <span className={styles.spanLink} onClick={() => router.push("/auth/signup")}>Signup</span>
          </li>
          </>
          ):(
          <li>
            <span className={styles.spanLink} onClick={handleLogout}>Signout</span>
          </li>
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
