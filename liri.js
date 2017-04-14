var operation = process.argv[2]; //takes in the liri command

//accessing Twitter npm
var Twitter = require('twitter');
var key = require('./keys.js');
var client = new Twitter(key.twitterKeys);

//accessing Spotify npm
var spotify = require('spotify');
var song = process.argv[3];

//accessing omdb npm
var request = require('request');
var movie = process.argv[3];
var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json";

//to read random.txt
var fs = require("fs");

//switch case to run functions based off of user input
switch (operation) {
	case 'my-tweets':
		showLastTweets();
		break;
	case 'spotify-this-song':
		spotifyIt();
		break;
	case 'movie-this':
		movieInfo();
		break;
	case 'do-what-it-says':
		randomize();
		break;
}

//shows last 20 tweets
function showLastTweets() {
	var params = {screen_name: 'trgmedina'};

	client.get('statuses/user_timeline', { count: 20 }, function(error, tweets, response) {
	  if (error) {
	    console.log('Error occurred: ' + error);
        return;
	  }
	  else {
	  	for (var i = 0; i < tweets.length; i++) {
	  		console.log(JSON.stringify(tweets[i].text));
	  	}
	  }
	});
}

//gets song info from spotify
function spotifyIt() {
	//if no song is entered, defaults to "The Sign" by Ace of Base
	if (!song) {
		song = 'the sign ace of base';
	}

	spotify.search({ type: 'track', query: song }, function(error, data) {
	    if (error) {
	        console.log('Error occurred: ' + error);
	        return;
	    }
	    else {
	    	var songInfo = data.tracks.items[0];
	    	
	    	console.log('Artist(s): ' + songInfo.artists[0].name);
	        console.log('Song Name: ' + songInfo.name);
	        console.log('Preview Link: ' + songInfo.preview_url);
	        console.log('Originating Album: ' + songInfo.album.name);
	    }
	});
}

//gets movie information
function movieInfo() {
	//if no movie name is inputted, defaults to "Mr. Nobody"
	if (!movie) {
		movie = 'Mr. Nobody';
		queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json";
	}

	request(queryUrl, function(error, response, body) {
		if (error) {
	        console.log('Error occurred: ' + error);
	        return;
	    }
	    else {
	    	console.log('Title: ' + JSON.parse(body).Title);
	    	console.log('Release Year: ' + JSON.parse(body).Year);
	    	console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
	    	console.log('Country: ' + JSON.parse(body).Country);
	    	console.log('Language: ' + JSON.parse(body).Language);
	    	console.log('Plot: ' + JSON.parse(body).Plot);
	    	console.log('Starring: ' + JSON.parse(body).Actors);
	    	console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[0].Value);
	    	//console.log('Rotten Tomatoes URL ' + )
	    }
	});
}

//reads a text file and pulls the command and input from a text file
function randomize() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		var dataArr = data.split(',');

		if (dataArr[0] === 'spotify-this-song') {
			song = dataArr[1];
			spotifyIt();
		}
		else if (dataArr[0] === 'movie-this') {
			movie = dataArr[1];
			movieInfo();
		}
		else if (dataArr[0] === 'my-tweets') {
			showLastTweets();
		}
	});
}

