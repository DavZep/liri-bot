require("dotenv").config();

// const Twitter = require("twit");
const Spotify = require("node-spotify-api");
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

const keys = require("./keys")
const spotifyAPI = new Spotify(keys.spotify);
// const twitterAPI = new Twitter(keys.twitter);

console.log("")

const liriBot = {
  //==========Option Choice===========================
  optionsPick: function(){
    inquirer
      .prompt([
        {
          type: "list",
          message: "Choose a LiRiBot command?",
          name: "option",
          choices: ["* my-tweets", "* spotify-this-song", "* movie-this", "* do-what-it-says", "* Cancel/Exit"],
          default: "* movie-this",
          validate: function (optionCancel){
            if(optionCancel === "* Cancel/Exit"){
              var logInf = "User logged off"
              liriBot.userLogg(logInf)
              console.log(logInf)
              process.exit()

            }
          }
        },
      ])
      .then (function(userChoice){
        // console.log(userChoice.option)
        //check which option is selected then run corresponding function
        switch(userChoice.option){
          case "* movie-this":
            liriBot.omdbQandSearch()
            break
          case "* my-tweets":
            liriBot.tweetSearch()
            break
          case "* spotify-this-song":
            liriBot.spotifyQandSearch()
            break
          case "* do-what-it-says":
            liriBot.doWhatItSays()
            break
          default:
              return
        }
      })
  },

  //========OMDB Search function for movie=========
  omdbSearch : function(m){

    if(m.length > 0) {

      m.replace(`"`, "")
      //replaces spaces with "+". ex: Back to the Future = Back+to+the+Future
      //OMDB search query api call requires it (data format), incase multiple spaces are used 
      var movieName = m.replace(/ /g, "+");
      //save HTTP request to a variable 
      var omdbQueryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${keys.omdb.api_key}`;
    
      axios.get(omdbQueryUrl)
      .then(function (response) {
        // handle success
        if(response.data.Error){
          //display error
          console.log(`\nOoops!...${response.data.Error}\n`);
          //prompt user to continue with another command or cancel
          liriBot.optionsPick()
        }else {//display all movie info
          var optionSelected = "\n====================================\nOption Selected: * Do-What-It-Says\n"
          var movieInfo = `\nMovie Result Info:\n* Title: ${response.data.Title}\n* Year Released: ${response.data.Released}\n* IMDB Rating: ${response.data.imdbRating}\n* ${response.data.Ratings[1].Source} Score: ${response.data.Ratings[1].Value} Fresh\n* Country Produced: ${response.data.Country}\n* Language: ${response.data.Language}\n* Actors: ${response.data.Actors}\n* Plot: ${response.data.Plot}\n`
          var logInfo = `${optionSelected} ${movieInfo}`
          console.log(movieInfo)
          
          liriBot.userLogg(logInfo)
          liriBot.optionsPick()
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        liriBot.optionsPick()
      })
    }
  },

  //========OMDB Question & Search function for movie=========
  omdbQandSearch: function(){
    //Ask user Q
    inquirer
      .prompt([
        {
          type: "input",
          message: "What movie may I search for you?",
          name: "movie",
          default: "fight club",
        },
      ])//function that takes Q answer and search for movie 
      .then (function(movieSearch){
        var movie = movieSearch.movie
        //check to make sure something is inputed
        liriBot.omdbSearch(movie)
      })
  },

  //==============Tweet function=================
  tweetSearch: function(randomText){


 
    //======LOG=================
  //   var test = `\n================================\nOption Selected: ${randomText}\nLog Tweets! tweeet tweeettw eeet!`
  //   logInfo = test
  //   liriBot.userLogg(logInfo)

  },

  //==============Spotify Question & Search function=================
  spotifyQandSearch: function(){
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
        // * Artist(s)
        // * The song's name
        // * A preview link of the song from Spotify
        // * The album that the song is from
        var song = trackSearch.track.replace(`'`, "")
        liriBot.spotifySearch(song)
      })
  },

  spotifySearch: function(song){
    //just search
    song.replace(`"`, "")

    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });
     
    spotify.search({ type: 'track', query: song }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      var optionSelect = `\n==========================================\nOption Selected: * Do-What-It-Says\n`
      var logInfo = `\n* Artist(s): ${data.tracks.items[0].artists[0].name}\n* Song Title: ${data.tracks.items[0].name}\n* Preview Link: ${data.tracks.items[0].external_urls.spotify}\n* Album: ${data.tracks.items[0].album.name}\n`
      console.log(logInfo);
      
      //prompt user to continue with another command or cancel
      liriBot.optionsPick()
      //=========LOG===============
      liriBot.userLogg(`${optionSelect}\n${logInfo}`)

    });

  },

  //=========Do What It Says function=================
  //function that does whats in the random txt file
  doWhatItSays: function(){

    fs.readFile("random.txt", "utf8", function(error, data) {

      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      }

      // Then split it by commas (to make it more readable)
      var dataArr = data.split(`,`);
      var randomText = dataArr[0]

      switch(randomText){
          case "* movie-this":
              liriBot.omdbSearch(dataArr[1])
              break
          case "* my-tweets":
              liriBot.tweetSearch(randomText)
              break
          case "* spotify-this-song":
              liriBot.spotifySearch(dataArr[1])
              break
          case "* do-what-it-says":
              liriBot.doWhatItSays()
              break
          default:
              return
      }
    });
  },

  //=====LOG Function==============================
  userLogg: function(logInfo){

    fs.appendFile("log.txt", logInfo, function(err) {
      
      // If an error was experienced we say it.
      if (err) {
        console.log(err);
      }
    
      // If no error is experienced, we'll log the phrase "Log success" to our node console.
      else {
        console.log("Log success!");
      }
    });
  },
}
liriBot.optionsPick()

//process.exit() will cancel

