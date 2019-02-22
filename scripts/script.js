// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

//appends to the DOM
myTuneApp.printResults = function (infoResults, trackResults, searchType){
    
    const $songList = $(".songList>ol");
    const $songImage = $(".songImage");
    const image = infoResults["image"][infoResults["image"].length - 1]["#text"]
    // use searchType to determine where to find artist name data
    const artistName = searchType === "initial" ? infoResults["artist"]["name"] : infoResults["name"];

    // empty display containers
    $songList.empty();
    $songImage.empty();
    
    // append image from infoResults
    $songImage.append(`<img src="${image}" alt="Image of ${artistName}">`);

    // append song names from trackResults
    trackResults.forEach((track) => {
        $songList.append(`<li>${track.name}</li>`);
    });
}
    //genre images sample:
    //results.tracks.track[0].image[results.tracks.track[0].image.length - 1]["#text"];

    //genre song sample:
    // results.tracks.track[0].name (drop name when passing)

    //top artists by genre 
    // const similarArtistsGenre = results3.topartists.artist


// get user input
myTuneApp.handleUserSearch = function (){

    $('header form').on('submit', (event) => {
        event.preventDefault();

        const $userInput = $('.searchBar>input[type="text"]');
        const $searchParameter = $('.searchFunction>input[name="searchParameter"]:checked');
        
        // search based on input value and search type selection
        if($userInput.val() && $searchParameter === "searchArtist"){
            this.getArtistData($userInput.val());

        } else if ($userInput.val() && $searchParameter === "searchGenre"){
            this.getGenreData($userInput.val());
        }

        $userInput.val("")
    });
};


myTuneApp.getGenreData = function (userGenreQuery){

    //returns name of track, artist and image of artist
    const getTrackInfo = $.ajax({
        // URL and Method are always stated outside of the data object (in jquery docs)
        // No method used here, due to the nature of the API
        url: myTuneApp.apiUrl,
        // data is the object of parameters, sent as a query string in a "GET" method 
        data: {
            api_key: myTuneApp.apiKey,
            method: 'tag.getTopTracks',
            tag: userGenreQuery,
            limit: 25,
            format: 'json'
        }
    })

    //similar artists by genre 
    // const getSimilarArtistGenre = $.ajax({
    //     url: myTuneApp.apiUrl,
    //     data: {
    //         api_key: myTuneApp.apiKey,
    //         method: "tag.getTopArtists",
    //         tag: userGenreQuery ,
    //         limit: 25,
    //         format: 'json'
    //     }
    // })
    // metadata: results3.topartists.artist 
    .then((results) => {
        console.log(results.tracks.track);

        //image is stored in an array which holds the track name and iimage
            // track name is iterated
            //image is not, how do we match the index of the track with the track name
        //first figure out how the image will change based on what the user clicks

        // myTuneApp.printResults(results.tracks.track[1], results.tracks.track);
    })
};




// searchQuery parameter: artist or genre name
// searchType parameter: user selected artist or genre search style
myTuneApp.getArtistData = function(userArtistQuery){

    ///artist info - includes artist name, images and 5 similar artist
    const getArtistInfo = $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: "artist.getinfo",
            artist: userArtistQuery,
            autocorrect: 1,
            format: "json"
        }
    })

    //top tracks of searched artist
    const getArtistTracks = $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: "artist.gettoptracks",
            artist: userArtistQuery,
            limit: 25,
            format: "json"
        }
    })

    $.when(getArtistInfo, getArtistTracks)

    .then((infoResults, trackResults) => {

        // call printResults with parameters for infoResults, trackResults and searchType
        myTuneApp.printResults(infoResults[0]["artist"], trackResults[0]["toptracks"]["track"], "searchQuery")
    })

    .fail((error) => {
        console.log(error)
    })
};

myTuneApp.getInitialData = function() {

    const intialData = $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: "geo.gettoptracks",
            country: "Canada",
            limit: 25,
            format: "json"
        }
    })

    .then((results) => {

        // call printResults with parameters for infoResults, trackResults and searchType
        myTuneApp.printResults(results["tracks"]["track"][0], results["tracks"]["track"], "initial");
    })
};


myTuneApp.init = function() {

    this.getInitialData();
    this.handleUserSearch();
};

$(function () {

    myTuneApp.init();
});