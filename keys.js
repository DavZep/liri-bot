// console.log('this is loaded');

exports.twitter = {
  twitter_user_id: process.env.TWITTER_USER_ID,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_key_secret: process.env.TWITTER_CONSUMER_KEY_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
exports.omdb = {
    api_key: process.env.OMDB_API_KEY
  };