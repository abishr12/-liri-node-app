//Calls Request Package
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var fs = require("fs");

//Pulls Spotify & Twitter API Authentication Info
var apiKeys = require("./keys.js");

//Determines which API to call
var command = process.argv[2];

//Search Query
var search = process.argv.slice(3).join(" ");

//Create log.txt file
if (fs.existsSync("log.txt") === false) {
  fs.writeFile("log.txt", "", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("log.txt was created!");
    }
  });
}

//Determines which API to use
function executeOperation() {
  switch (command) {
    case "movie-this":
      movieSearch();
      break;
    case "spotify-this-song":
      musicSearch();
      break;
    case "my-tweets":
      twitterSearch();
      break;
    case "do-what-it-says":
      readTheFile();
      break;
  }
  writeToLog();
}

//Requesting from the OMDB API
function movieSearch() {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=40e9cece";

  request(queryUrl, function(err, res, body) {
    if (err) {
      throw err;
    }
    // console.log(body);
    var obj = JSON.parse(body);
    console.log("Title: " + obj.Title);
    console.log("Release Year: " + obj.Year);
    console.log("imdbRating: " + obj.imdbRating);
    console.log("Rotten Tomatoes Score: " + obj.Ratings[2].Value);
    console.log("Country: " + obj.Country);
    console.log("Language: " + obj.Language);
    console.log("Plot: " + "\n" + obj.Plot);
    console.log("Actors: " + obj.Actors);
  });
}

//Use Spotify API
function musicSearch() {
  var spotify = new Spotify({
    id: apiKeys.spotifyKeys.clientId,
    secret: apiKeys.spotifyKeys.clientSecret
  });
  spotify.search({ type: "track", query: search }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    console.log("Name: " + data.tracks.items[0].name);
    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log(
      "Listen To It Now: " + data.tracks.items[0].external_urls.spotify
    );
  });
}

//Search Twitter
function twitterSearch() {
  var client = new Twitter({
    consumer_key: apiKeys.twitterKeys.consumer_key,
    consumer_secret: apiKeys.twitterKeys.consumer_secret,
    access_token_key: apiKeys.twitterKeys.access_token_key,
    access_token_secret: apiKeys.twitterKeys.access_token_secret
  });
  var params = { screen_name: "droxey" };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        console.log(tweets[i].created_at, "\n", tweets[i].text);
      }
    }
  });
}

//do-what-it-says file from
function readTheFile() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log(err);
    }
    array = data.split(",");
    command = array[0];
    search = array[1];
    executeOperation();
  });
}
//Capitalizes Each Word
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

//Log operations to log.txt
function writeToLog() {
  fs.appendFile("log.txt", "\n" + search + " " + command, err => {
    if (err) throw err;
  });
}
executeOperation();
