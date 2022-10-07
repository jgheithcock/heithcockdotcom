import HomePageLayout from "../../components/homePageLayout";
import Feed from "../../components/feed";
import { getAllHomePageIds, getHomePageData } from "../../lib/homepages";
import { capitalizeWords } from "../../lib/utils";

export async function getStaticPaths() {
  const paths = getAllHomePageIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = getHomePageData(params.id);
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data: { id, theme, feed_list, feeds } }) {
  const title = `${capitalizeWords(id)}'s Home`;
  // array of columns of feeds
  const all_feeds = feed_list.map((col) =>
    col.map((fid) => <Feed key={fid} feed_id={fid} {...feeds[fid]}></Feed>)
  );
  return (
    <HomePageLayout title={title} theme={theme}>
      {all_feeds}
    </HomePageLayout>
  );
}
