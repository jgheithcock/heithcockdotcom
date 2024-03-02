import Header from "./header";
import Footer from "./footer";
import Meta from "../meta";
import styles from "../../styles/Main.module.css";

const Layout = ({ preview, children, ...props }) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen main">
        <Header {...props} />
        <main className={styles.main}>{children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
