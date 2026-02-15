//WEEK 14-add component
import { Link } from 'react-router';
import styles from '../App.module.css';

function NotFound() {
  return (
    <div className={styles.container}>
      <p> Page not found.</p>
      <Link to="/"> Return to Home </Link>
    </div>
  );
}

export default NotFound;
