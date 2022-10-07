export function getAllHomePageIds() {
  return Object.keys(homePages).map((id) => ({ params: { id } }));
}
export function getHomePageData(id) {
  // Combine the data with the id
  return {
    id,
    theme: homePages[id]["theme"],
    feed_list: homePages[id]["feed_list"],
    feeds,
  };
}

// homePages - list of columns of feed ids
const homePages = {
  suzy: {
    theme: "sunset",
    feed_list: [
      ["top_news", "movies", "burn_status"],
      ["bbc_news", "time_news", "laff_gaff", "earthquakes"],
      ["weather", "espn_tennis", "bbc_tennis", "wiki_how"],
    ],
  },
  jg: {
    theme: "sunset",
    feed_list: [["weather"], ["accuweather"], ["laff_gaff"]],
  },
  morgan: {
    theme: "sunset",
    feed_list: [["boston_weather"], ["bbc_news"], ["laff_gaff"]],
  },
};

const feeds = {
  top_news: {
    title: "Top News",
    url: "https://news.google.com/news/feeds?pz=1&authuser=1&cf=all&ned=us&hl=en&topic=h&num=5&output=rss",
    feed_type: "RSS",
    show_feeds: "never",
  },

  movies: {
    title: "Movies",
    url: "https://www.fandango.com/rss/newmovies.rss",
    feed_type: "RSS",
    show_feeds: "always",
  },

  burn_status: {
    title: "Spare The Air",
    url: "https://www.baaqmd.gov/Feeds/AlertRSS.aspx",
    feed_type: "RSS",
    show_feeds: "always",
  },

  bbc_news: {
    title: "BBC World News",
    url: "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/world/rss.xml",
    feed_type: "RSS",
  },

  time_news: {
    title: "TIME.com Top Stories",
    url: "http://feeds.feedburner.com/time/topstories.xml",
    feed_type: "RSS",
    show_feeds: "never",
  },

  djtaf: {
    title: "Dumb Jokes That Are Funny - The Oatmeal",
    url: "https://theoatmeal.com/djtaf/",
    feed_type: "djtaf",
  },

  just_clean_jokes: {
    title: "Just Jokes",
    url: "http://www.justcleanjokes.com/rss_feed.xml",
    feed_type: "RSS",
    show_feeds: "always",
  },

  laff_gaff: {
    title: "Laff Gaff",
    url: "https://laffgaff.com/funny-joke-of-the-day/feed/",
    feed_type: "RSS",
    show_feeds: "always",
  },

  earthquakes: {
    title: "Earthquakes",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.atom",
    feed_type: "RSS",
    show_feeds: "off",
  },

  weather: {
    title: "Weather",
    url: "http://www.rssweather.com/zipcode/94549/rss.php",
    feed_type: "RSS",
    show_feeds: "always",
  },

  boston_weather: {
    title: "Boston Weather",
    url: "https://www.rssweather.com/zipcode/02115/rss.php",
    feed_type: "RSS",
    show_feeds: "always",
  },

  accuweather: {
    title: "Lafayette Weather",
    url: "https://rss.accuweather.com/rss/liveweather_rss.asp?locCode=94549",
    feed_type: "RSS",
    show_feeds: "always",
  },

  espn_tennis: {
    title: "ESPN Tennis News",
    url: "http://sports.espn.go.com/espn/rss/tennis/news",
    feed_type: "RSS",
  },

  bbc_tennis: {
    title: "BBC Tennis News",
    url: "http://news.bbc.co.uk/rss/sportonline_world_edition/tennis/rss091.xml",
    feed_type: "RSS",
  },

  wiki_how: {
    title: "How to of the Day",
    url: "http://www.wikihow.com/feed.rss",
    feed_type: "RSS",
    show_feeds: "never",
  },
};
