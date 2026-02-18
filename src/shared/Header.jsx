//WEEK 14 setup component
import { NavLink } from 'react-router';
import styles from './Header.module.css';

function Header({ title }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <nav className={styles.nav}>
        {/* input NavLink her */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
export default Header;
