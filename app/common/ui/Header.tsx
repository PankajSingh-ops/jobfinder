"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          <li>
            {/* Use a span or button instead of <a> */}
            <span className={styles.spanLink} onClick={() => router.push("/auth/login")}>Login</span>
          </li>
          <li>
            <span className={styles.spanLink} onClick={() => router.push("/auth/signup")}>Signup</span>
          </li>
          <li>
            <span className={styles.spanLink} onClick={() => router.push("/signout")}>Signout</span>
          </li>
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
