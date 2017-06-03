//Import the required dependencies
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var lineReader = require("line-reader");
var fs = require("fs");

//Get Twitter Keys
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

//Get Spotify Keys
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
});

function logWriter(data) {
  fs.writeFile('log.txt', data,  {'flag':'a'},  function(err) {
    if (err) {
        return console.error(err);
    }
});
}

function spotifySong(trackName) {
    spotify.search({
        type: 'track',
        query: trackName,
        limit: 1
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("######## Hey - Here is your search results for Spotify ###########################\n");
        var songReturned = data.tracks.items[0];
        songReturned.album.artists.forEach(function(artist, index) {
        console.log("Artist(s): \n" + (index + 1) + ") " + artist.name)
        })

        console.log("Album Name: " + songReturned.album.name);
        console.log("Song Name: " + songReturned.name);
        console.log("Preview URL: " + songReturned.preview_url);
        console.log("\n######## Done with Spotify #########################################################");

    })
};
//Function to get Tweets using Twitter Module
function fetchTweets() {
    client.get('search/tweets', {
        q: 'NodePianoMan',
        count: 20
    }, function(error, tweets, response) {
        console.log("Here is my Tweets!")
        tweets.statuses.forEach(function(tweet, index) {
            console.log((index + 1) + ") " + tweet.text);
        })

        console.log("Closing Tweets!")

    });

}

function convertRandomTextToArray() {
  var dataArray = [];
  lineReader.eachLine("./random.txt", function(line, last) {

      dataArray.push(line);
      if (last) {
          getRandomSelection(dataArray);
      }
  });
}

function launchApp(instruction, data) {
    switch (instruction) {
        case "my-tweets":
            fetchTweets();
            break;
        case "spotify-this-song":
            spotifySong(data);
            break;
        case "do-what-it-says":
            convertRandomTextToArray();
            break;
         default:
              console.log("Invalid attempt");
              logWriter("Invalid Attempt");
    }

}



function getRandomSelection(dataArray) {
    console.log(dataArray.length);

    var randomNumber = Math.floor(Math.random() * dataArray.length)+1;
    var randomInstruction = dataArray[randomNumber-1].split(",");

    console.log(randomInstruction[0] + "  " + randomInstruction[1]);
    launchApp(randomInstruction[0], randomInstruction[1]);

}
//Program starter function

launchApp(process.argv[2],process.argv[3]);


/*




else if (process.argv[2] == "movie-this") {
    console.log("Hello Movie");
    request('http://www.omdbapi.com/?i=tt3896198&apikey=87c66fec', function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
} */
