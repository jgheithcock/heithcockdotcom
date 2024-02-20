import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "../components/main/layout";
import HeroPost from "../components/main/hero-post";
import { getPosts, getHeroPost } from "../lib/mainpages";
import FolderList from "../components/main/folder-list";

export default function Index({ heroPost, posts }) {
  // const router = useRouter();
  // -> router.basePath: '', asPath: '/', pathname: '/'
  return (
    <Layout>
      <Head>
        <title>The Curmudgeonly Codger</title>
        <meta property="og:image" content={"/images/bob-the-guard.jpeg"} />
        <meta name="description" content="JG Heithcock's website" />
      </Head>
      {/* <HeroPost {...heroPost} /> */}
      <FolderList posts={posts} />
    </Layout>
  );
}

export const getStaticProps = async (context) => {
  const posts = getPosts("", [
    "type",
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);
  const heroPost = getHeroPost(posts);

  return {
    props: { heroPost, posts },
  };
};
