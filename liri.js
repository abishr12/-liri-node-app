//Calls Request Package
var request = require("request");
//Determines which API to call
var command = process.argv[2];
//Search Query
var search = process.argv.slice(3).join(" ");

switch (command) {
  case "movie-this":
    movieSearch();
    break;
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

//Capitalizes Each Word
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
