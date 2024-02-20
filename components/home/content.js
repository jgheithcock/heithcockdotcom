import useSWR from "swr";
import RssContent from "./rss_content";

export default function Content({ url, feed_type, ...props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.text());
  const feed_url = `/api/proxy?url=${url}`;
  const { data, error } = useSWR(feed_url, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  if (data.length <= 4) {
    return (
      <div style={{ background: "#fff", padding: "1em" }}>Error: {data}</div>
    );
  }
  if (feed_type == "RSS")
    return <RssContent data={data} {...props}></RssContent>;
  return <div>No feed type known for {feed_type}!</div>;
}
