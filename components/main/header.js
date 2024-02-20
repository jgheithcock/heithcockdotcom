import Link from "next/link";
import styles from "../../styles/Main.module.css";

const Header = () => {
  return (
    <header>
      <h1 className={`${styles.title} ${styles.header}`}>
        <Link href="/">The Curmudgeonly Codger</Link>
      </h1>
    </header>
  );
};

export default Header;
