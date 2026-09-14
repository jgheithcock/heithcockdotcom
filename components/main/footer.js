import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Main.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { asPath } = useRouter();
  const path = asPath.split("?")[0].split("#")[0];

  return (
    <footer className={`${styles.footer} chrome`}>
      <p>
        <span className={styles.printUrl}>heithcock.com{path} | </span>
        Copyright © <Link href="/about">JG Heithcock</Link> {currentYear}
      </p>
    </footer>
  );
};

export default Footer;
