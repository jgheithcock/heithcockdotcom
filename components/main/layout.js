import Header from "./header";
import Footer from "./footer";
import Meta from "../meta";
import styles from "../../styles/Main.module.css";

const Layout = ({ preview, children }) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
