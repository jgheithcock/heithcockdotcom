import Link from "next/link";
// import Image from "next/image";
import styles from "../../styles/Main.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={`${styles.footer} chrome`}>
      <p>
        Copyright © <Link href="/about">JG Heithcock</Link> {currentYear}
      </p>
    </footer>
  );
};

export default Footer;
