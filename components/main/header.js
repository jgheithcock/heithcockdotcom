import Link from "next/link";
import NavLinks from "./nav-links.js";
import styles from "../../styles/Main.module.css";

const Header = ({ ...props }) => {
  return (
    <header>
      <h1 className={styles.header}>
        <Link href="/">
          <a className={styles.title}>The Curmudgeonly Codger</a>
        </Link>
        <NavLinks {...props} />
      </h1>
    </header>
  );
};

export default Header;
