//WEEK 14 setup component
import { Link } from 'react-router';
import styles from '../App.module.css';
function About() {
  return (
    <div className={styles.container}>
      <p>
        Todo List which demonstrates Intro to React V3. Its features include:
        dynamic routing, fetching from Airtable, management of tasks in a list
      </p>
    </div>
  );
}

export default About;
