import Link from "next/link";
import Parser from "rss-parser";
import { useState, useEffect } from "react";
import React from "react";

export default function RssContent({ data }) {
  // Test
  const [feedItems, setFeedItems] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const sanitizeHTML = (text) =>
    text.replace("[time-brightcove not-tgx=&#8221;true&#8221;]", "");

  useEffect(() => {
    async function parseData(data) {
      const parser = new Parser();
      await parser.parseString(data, function (err, feed) {
        if (err) throw err;
        console.log(feed.title);
        console.log(`# feed.items => ${feed.items.length}`);
        const items = feed.items.map((item) => (
          <>
            <dt key={item.guid}>
              <a href={item.link || "#"}>
                <>{item.title}</>
              </a>
              {/* For weather, first title is "Lafayette, CA Weather :: 74F Mostly Cloudy" - be nice to strip after "::" */}
            </dt>
            <dd>
              {item["content:encoded"] ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(item["content:encoded"]),
                  }}
                ></span>
              ) : item.content && item.content[0] == "<" ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(item.content),
                  }}
                ></span>
              ) : item.summary && item.summary[0] == "<" ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(item.summary),
                  }}
                ></span>
              ) : item.summary ? (
                item.summary
              ) : (
                item.content
              )}
            </dd>
            {/* title, link, pubDate, content, contentSnippet, guid, categories, isoDate - where guid is misc type and date, category is either "Current Conditions" or "Weather Forecast" */}
          </>
        ));
        setFeedItems(items);
        setLoading(false);
      });
    }
    parseData(data);
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!feedItems) return <p>No feed data</p>;
  if (feedItems.length == 0) return <p>Zero feed items</p>;

  return <dl>{feedItems}</dl>;
}
