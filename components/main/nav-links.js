import styles from "../../styles/Main.module.css";
import { LeftArrowIcon, UpArrowIcon, RightArrowIcon, Icon } from "./icons";

const NavLinks = ({ parentPost, previousPost, nextPost = {} }) => {
  if (!parentPost) return null;
  return (
    <span className={styles.NavLinks}>
      {previousPost && (
        <span className="prevBtn">
          <LeftArrowIcon title={previousPost.title} url={previousPost.slug} />
          &nbsp;&nbsp;
        </span>
      )}
      {parentPost && (
        <span className="upBtn">
          <UpArrowIcon title={parentPost.title} url={parentPost.slug} />
          &nbsp;&nbsp;
        </span>
      )}
      {nextPost && (
        <span className="nextBtn">
          <RightArrowIcon title={nextPost.title} url={nextPost.slug} />
        </span>
      )}
    </span>
  );
};

export default NavLinks;
