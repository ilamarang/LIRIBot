//Import the required dependencies
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: keys.spotifyKeys.client_id,
  secret: keys.spotifyKeys.client_secret
});

if(process.argv[2]=="my-tweets") {
  client.get('search/tweets',{q: 'NodePianoMan', count:20},function(error, tweets, response) {
    console.log("Here is my Tweets!")
    tweets.statuses.forEach(function(tweet,index) {
      console.log((index+1) + ") " + tweet.text);
    })

    console.log("Closing Tweets!")
  });

} else if(process.argv[2]=="spotify-this-song") {
  var trackName = process.argv[3];
  spotify.search({ type: 'track', query: trackName,limit:1 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

console.log("######## Hey - Here is your search results for Spotify ###########################\n");

var songReturned = data.tracks.items[0];

//console.log(JSON.stringify(data.tracks.items[0]));

songReturned.album.artists.forEach(function(artist,index) {
  console.log("Artist(s): \n" + (index+1) + ") " +  artist.name)

})

console.log("Album Name: " + songReturned.album.name);

console.log("Song Name: " + songReturned.name);

console.log("Preview URL: " + songReturned.preview_url);

console.log("\n######## Done with Spotify #########################################################");

});
}
