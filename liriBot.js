var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keysJS = require('./keys.js');
var fs = require("fs");
var spotifySearch;
var movieSearch;
var omdbKey = "a93e5cb5";

var spotify = new Spotify({
	id: "1d1ead69149f4f70a9190fac99332a3f",
	secret: "1f5c9e2288f447fd93265154e788d2de"
});

// FUNCTION FOR TWITTER CALLS
var twitCall = function(){
	var client = new Twitter({
	  	consumer_key: keysJS.consumer_key,
		consumer_secret: keysJS.consumer_secret,
		access_token_key: keysJS.access_token_key,
		access_token_secret: keysJS.access_token_secret
	});
	client.get('statuses/user_timeline', 'liribot4lyfe', function(error, tweets, response) {
	  if (error) {
	    console.log(error);
	  } else {
	  	console.log("\n \n Recent Tweets:");
	  	for (var i = 0; i < tweets.length; i++) {
	  		var theTweet = tweets[i].text;
	  		var timestamp = tweets[i].created_at;
	  		console.log("\n "+theTweet+"\n created: "+timestamp);
	  		console.log("\n-------------------------------------");
	  	}
	  }
	});
}

// FUNCTION FOR SPOTIFY CALLS
var spotCall = function(){
	spotify.search({ type: 'track', query: spotifySearch })
	.then(function(response) {
    	for (var i = 0; i < 5; i++) {
    		var sumSearch = response.tracks.items[i];
    		var artists = sumSearch.artists[0].name;
    		var songName = sumSearch.name;
    		var songAlbum = sumSearch.album.name;
    		var previewLink = sumSearch.preview_url;
    		console.log("Artist: " + artists);
    		console.log("Song Title: " + songName);
    		console.log("Album Title: " + songAlbum);
    		console.log("Preview Song: " + previewLink);
    		console.log("---------------------");
    	}
  	}).catch(function(err) {
    	console.log(err);
  	});
};

// FUNCTION FOR OMDB CALLS
var omdbCall = function(){
	request("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=a93e5cb5", function(error, response, body) {
		if (error) {
			console.log(error)
		}
		var dataReturn = JSON.parse(body);
		var title = dataReturn.Title;
		var year = dataReturn.Year;
		var rating = dataReturn.Ratings[0].Value;
		var rtRating = dataReturn.Ratings[1].Value;
		var country = dataReturn.Country;
		var language = dataReturn.Language;
		var plot = dataReturn.Plot;
		var actors = dataReturn.Actors;
		var display = "\n \n Title: "+title+"\n Year: "+year+"\n IMDB Rating: "+rating+"\n Rotten Tomatoes Rating: "+rtRating+"\n Country of Production: "+country+"\n Languages: "+language+"\n Plot: "+plot+"\n Actors: "+actors+"\n \n";
		console.log(display);
	});
};

// FUNCTION FOR READING & ACTING ON RANDOM.TXT FILE
var readAndAct = function(){
	fs.readFile("./random.txt", "utf8", function(err, data){
		if (err) {
			return console.log(err);
		}
		var textArray = data.split(',');
		process.argv[2] = textArray[0]
		process.argv[3] = textArray[1].replace(/"/g, " ").trim();
		runChecker();
	});
};

// FUNCTION FOR WRITING MOVIE AND SPOTIFY SEARCHES TO A LOG
var writeToLog = function(){
	var mySearch = process.argv.splice(3, process.argv.length).toString().replace(/,/g, " ");
	var appendInfo = process.argv[2]+", "+mySearch+"\n";
	console.log(appendInfo);
	fs.appendFile("./log.txt", appendInfo, function(err, data){
		if (err){
			console.log(err);
		} else {
			console.log("data appended");
		}
	});
};

// FUNCTION THAT DETERMINES HOW TO ACT ON TERMINAL/CONSOLE INPUT
var runChecker = function(){
	if (process.argv[2] === "my-tweets"){
		twitCall();
	}
	else if (process.argv[2] === "spotify-this-song"){
		if (!process.argv[3]) {
			spotifySearch = "the+sign+ace+of+base";
			spotCall();
		} else {
			spotifySearch = process.argv.slice(3, process.argv.length).toString().replace(/,/g, "+");
			spotCall();
			writeToLog();
		}
	}
	else if (process.argv[2] === "movie-this"){
		if (!process.argv[3]){
			movieSearch = "Mr+Nobody";
			omdbCall();
		} else {
			movieSearch = process.argv.slice(3, process.argv.length).toString().replace(/,/g, "+");
			omdbCall();
			writeToLog();
		}
	}
	else if (process.argv[2] === "do-what-it-says"){
		readAndAct();
	} else {
		console.log("please enter: 'my-tweets', 'spotify-this-song', 'movie-this' or 'do-what-it-says'");
	}
};
runChecker();

