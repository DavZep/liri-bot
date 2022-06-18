require("dotenv").config();

const keys = require("./keys")
const TwitterAPI = require('twit');

const client = new TwitterAPI({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_key_secret,
  access_token: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
  // bearer_token: keys.twitter.bearer_token
});
 

const { data } = async () => {
  await client.get('tweets', { ids: '1537242473272967168' });
  console.log(data);
}

