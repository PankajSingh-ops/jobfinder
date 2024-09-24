import Image from "next/image";
import styles from "./Header.module.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { NextRouter } from "next/router";

interface MenuProps {
  menuOpen: boolean;
  isLogin: boolean;
  router: NextRouter;
  toggleMenu: () => void;
  handleLogout: () => void;
  toggleDropdown: () => void;
  dropdownOpen: boolean;
  getProfileImage: () => string;
}

export default function Menu({
  menuOpen,
  isLogin,
  router,
  toggleMenu,
  handleLogout,
  toggleDropdown,
  dropdownOpen,
  getProfileImage,
}: MenuProps) {
  return (
    <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
      <ul>
        {!isLogin ? (
          <>
            <li>
              <span className={styles.spanLink} onClick={() => { router.push("/auth/login"); toggleMenu(); }}>Login</span>
            </li>
            <li>
              <span className={styles.spanLink} onClick={() => { router.push("/auth/signup"); toggleMenu(); }}>Signup</span>
            </li>
          </>
        ) : (
          <>
            {!menuOpen && (
              <div className={styles.profileContainer} onClick={toggleDropdown}>
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
                  <li>
                    <AccountCircleIcon className={styles.icon} />
                    <span className={styles.spanLink1}>Profile</span>
                  </li>
                  <li>
                    <LogoutIcon className={styles.icon} />
                    <span className={styles.spanLink1} onClick={() => { handleLogout(); toggleMenu(); }}>Signout</span>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
