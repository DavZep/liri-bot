require("dotenv").config();

const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

const keys = require("./keys")
const spotifyAPI = new Spotify(keys.spotify);
const twitterAPI = new Twitter(keys.twitter);

const appData = {
    optionChoice: function(){
        inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do, pick one?",
                name: "option",
                choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
                default: "movie-this",
            },
        ])
        .then (function(userChoice){
            // console.log(userChoice.option)
            //check which option is selected then run corresponding function
            switch(userChoice.option){
                case "movie-this":
                    appData.omdbSearch()
                    break
                case "my-tweets":
                    console.log("Tweet tweeet tweeettw eeet!")
                    appData.tweetSearch()
                    break
                case "spotify-this-song":
                    appData.spotifySong()
                    break
                case "do-what-it-says":
                    console.log("Do what is say!")
                    appData.doWhatItSays()
                    break
                default:
                    return
            }

        })

    },
    //search OMDB function for movie
    omdbSearch: function(){
        inquirer
        .prompt([
            {
                type: "input",
                message: "What movie may I search for you?",
                name: "movie",
                default: "fight club",
            },
        ])
        .then (function(movieSearch){
            // console.log(movieSearch.movie)
            if(movieSearch.movie.length > 0) {
                //replaces spaces with "+". ex: Back to the Future = Back+to+the+Future
                //OMDB search query api call requires it, incase multiple spaces are used 
                var movieName = movieSearch.movie.replace(/ /g, "+");
                //save HTTP request to a variable 
                var omdbQueryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${keys.omdb.api_key}`;
                //require axios package
                const axios = require('axios').default;
              
                axios.get(omdbQueryUrl)
                .then(function (response) {
                  // handle success
                  if(response.data.Error){
                    console.log(`Ooops!...${response.data.Error}`);
                  }else {//display all movie info
                    var logInfo = `\n===================\nMovie Result Info:\n* Title: ${response.data.Title}\n* Year Released: ${response.data.Released}\n* IMDB Rating: ${response.data.imdbRating}\n* ${response.data.Ratings[1].Source} Score: ${response.data.Ratings[1].Value} Fresh\n* Country Produced: ${response.data.Country}\n* Language: ${response.data.Language}\n* Actors: ${response.data.Actors}\n* Plot: ${response.data.Plot}\n`
                    console.log(logInfo)
                    
                    fs.appendFile("log.txt", `${logInfo}`, function(err) {

                        // If an error was experienced we say it.
                        if (err) {
                          console.log(err);
                        }
                      
                        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                        else {
                          console.log("Content logged!");
                        }
                      
                      });
            
                }
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
              }else {
                console.log("Please enter a movie title");
              }

        })
    },
    //Tweet function
    tweetSearch: function(){
        // var tweetQueryUrl = `https://api.twitter.com/2/tweets/search/all?max_results=20&tweet.fields=created_at" -H "Authorization: Bearer $BEARER_TOKEN"`



    },
    //Song function
    spotifySong: function(){
        inquirer
        .prompt([
            {
                type: "input",
                message: "What Song may I search for you?",
                name: "track",
                default: "never gonna give you up",
            },
        ])
        .then (function(trackSearch){
            console.log(trackSearch.track)
        })
        var song = trackSearch.track
        var spotQueryUrl = `https://api.spotify.com/&spotify:track:${song}`


    },
    //function that does whats in the random txt file
    doWhatItSays: function(){
        fs.readFile("random.txt", "utf8", function(error, data) {
            // If the code experiences any errors it will log the error to the console.
            if (error) {
              return console.log(error);
            }
            // We will then print the contents of data
            console.log(data);
          
            // Then split it by commas (to make it more readable)
            var dataArr = data.split(`,`);
          
            // We will then re-display the content as an array for later use.
            console.log(dataArr);
          
          });
    },
    userLogg: function(){
        fs.appendFile("log.txt", "test", function(err) {

            // If an error was experienced we say it.
            if (err) {
              console.log(err);
            }
          
            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
            else {
              console.log("Content Added!");
            }
          
          });
    },

}
appData.optionChoice()

