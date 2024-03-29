import Link from "next/link";
import Parser from "rss-parser";
import { useState, useEffect } from "react";
import React from "react";
import styles from "../../styles/Home.module.css";

export default function RssContent({ data, show_feeds }) {
  // Test
  const [feedItems, setFeedItems] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const sanitizeHTML = (item) => {
    const text =
      item.content == "wikihow is in hell" // strange 'bug' where wikihow takes over screen
        ? "unavailable"
        : typeof item["content:encoded"] != "undefined"
        ? item["content:encoded"]
        : typeof item.content != "undefined"
        ? item.content
        : item.summary;
    /* time-brightcove tags are visible in Times feed, remove them */
    return text
      .replace("[time-brightcove not-tgx=&#8221;true&#8221;]", "")
      .replace(
        '[lightweight-accordion title="Show answer" title_background="#efefef" bordered=true]',
        ""
      )
      .replace("[/lightweight-accordion]", "") // laff-gaff
      .trim();
  };

  /* For weather, first title is "Lafayette, CA Weather :: 74F Mostly Cloudy" - be nice to strip after "::" */
  useEffect(() => {
    const DT = ({ title, link, closeFeed }) => {
      const feed_class = closeFeed ? "closed" : "open";
      const disclose =
        show_feeds != "always" ? (
          <button
            className={styles.feed_hider}
            onClick={(evt) => {
              const par = evt.currentTarget.parentNode;
              par.className = par.className == "open" ? "closed" : "open";
            }}
          >
            <i className="fa disclosure"> </i>
          </button>
        ) : null;
      return (
        <dt className={feed_class}>
          {disclose}
          <a href={link || "#"}>{title}</a>
        </dt>
      );
    };

    const DD = (item) => {
      const text = sanitizeHTML(item);
      const child =
        text[0] == "<" ? (
          <span
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(item),
            }}
          ></span>
        ) : (
          text
        );
      return <dd>{child}</dd>;
    };
    async function parseData(data) {
      const parser = new Parser();
      await parser.parseString(data, function (err, feed) {
        if (err) throw err;
        let closeFeed = show_feeds == "never";
        const items = feed.items.map((item) => {
          const key_str = item.guid || item.link || item.title;
          if (typeof key_str.toString === "undefined") return null;
          const new_item = (
            <React.Fragment key={key_str}>
              <DT {...item} closeFeed={closeFeed}></DT>
              <DD {...item}></DD>
              {/* title, link, pubDate, content, contentSnippet, guid, categories, isoDate - where guid is misc type and date, category is either "Current Conditions" or "Weather Forecast" */}
            </React.Fragment>
          );
          closeFeed = show_feeds != "always";
          return new_item;
        });
        setFeedItems(items);
        setLoading(false);
      });
    }
    parseData(data);
  }, [data, show_feeds]);

  if (isLoading) return <p>Loading...</p>;
  if (!feedItems) return <p>No feed data</p>;
  if (feedItems.length == 0) return <p>Zero feed items</p>;

  return <dl>{feedItems}</dl>;
}
