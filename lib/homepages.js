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
      ["bbc_news", "time_news", "djtaf", "earthquakes"],
      ["weather", "espn_tennis", "bbc_tennis", "wiki_how"],
    ],
  },
  jg: { theme: "sunset", feed_list: [] },
  morgan: { theme: "sunset", feed_list: [] },
};

const feeds = {
  top_news: {
    title: "Top News",
    url: "https://news.google.com/news/feeds?pz=1&authuser=1&cf=all&ned=us&hl=en&topic=h&num=5&output=rss",
    feed_type: "News",
  },

  movies: {
    title: "Movies",
    url: "https://www.fandango.com/rss/newmovies.rss",
    feed_type: "RSS",
  },

  burn_status: {
    title: "Spare The Air",
    url: "https://www.baaqmd.gov/Feeds/AlertRSS.aspx",
    feed_type: "RSS",
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
  },

  djtaf: {
    title: "Dumb Jokes That Are Funny - The Oatmeal",
    narrehat_url: "http://www.narrehat.dk/cgi-bin/show_next_uk_joke_mobile.cgi",
    aha_jokes_url: "http://www.ahajokes.com/#.joke",
    url: "https://theoatmeal.com/djtaf/",
    feed_type: "djtaf",
  },

  earthquakes: {
    title: "Earthquakes",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.atom",
    feed_type: "RSS",
  },

  weather: {
    title: "Weather",
    url: "http://www.rssweather.com/zipcode/94549/rss.php",
    feed_type: "RSS",
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
  },
};
