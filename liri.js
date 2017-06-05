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
  fs.writeFile('log.txt', data + '\n',  {'flag':'a'},  function(err) {
    if (err) {
        return console.error(err);
    }
});
console.log(data);
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

        logWriter("######## Hey - Here is your search results for Spotify ###########################");
        var songReturned = data.tracks.items[0];
        songReturned.album.artists.forEach(function(artist, index) {
        logWriter("Artist(s): \n" + (index + 1) + ") " + artist.name);
        })

        logWriter("Album Name: " + songReturned.album.name);
        logWriter("Song Name: " + songReturned.name);
        logWriter("Preview URL: " + songReturned.preview_url);
        logWriter("######## Done with Spotify #########################################################");

    })
};
//Function to get Tweets using Twitter Module
function fetchTweets() {
    client.get('search/tweets', {
        q: 'NodePianoMan',
        count: 20
    }, function(error, tweets, response) {

        logWriter("Here is my Tweets!");
        tweets.statuses.forEach(function(tweet, index) {
            //console.log((index + 1) + ") " + tweet.text);
            logWriter((index + 1) + ") " + tweet.text);
        })

        logWriter("Closing Tweets!");
    });

}
function findMovie(data) {
  request('http://www.omdbapi.com/?t=' + data + '&apikey=40e9cece&tomatoes=true', function(error, response, body) {

      if(error)
      {
          console.log('error:', error);
      } else {
          var movieObject = JSON.parse(body);
          console.log("####################################################################################");
          console.log("Your Movie Information is displayed here");
          console.log("Title: " +movieObject.Title);
          console.log("Year: " +movieObject.Year);
          console.log("Rating: " +movieObject.imdbRating);
          console.log("Country: " +movieObject.Country);
          console.log("Language: " +movieObject.Language);
          console.log("Plot: " +movieObject.Plot);
          console.log("Actors: " +movieObject.Actors);
          console.log("Rotten Tomatoes URL: " +movieObject.tomatoURL);
          console.log("####################################################################################");

      }


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

//Determine the function to call based on the input
function launchApp(instruction, data) {
    switch (instruction) {
        case "my-tweets":
            fetchTweets();
            break;
        case "spotify-this-song":
            spotifySong(data);
            break;
        case "movie-this":
            findMovie(data);
            break;
        case "do-what-it-says":
            convertRandomTextToArray();
            break;
         default:
            logWriter("Invalid Attempt");
    }

}



function getRandomSelection(dataArray) {
    //console.log(dataArray.length);

    var randomNumber = Math.floor(Math.random() * dataArray.length)+1;
    var randomInstruction = dataArray[randomNumber-1].split(",");

    //console.log(randomInstruction[0] + "  " + randomInstruction[1]);
    launchApp(randomInstruction[0], randomInstruction[1]);

}
//Launch the main function

launchApp(process.argv[2],process.argv[3]);
