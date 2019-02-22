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
    $songImage.append(`<img src="${image}" alt="Image of ${artistName}">`)

    // append song names from trackResults
    trackResults.forEach((track) => $songList.append(`<li>${track.name}</li>`));
};


// get user input
myTuneApp.handleUserSearch = function (){

    $('header form').on('submit', (event) => {
        event.preventDefault();

        const $userInput = $('.searchBar>input[type="text"]');

        if($userInput.val()){
            this.getArtistData($userInput.val());
        }

        $userInput.val("")
        
    });
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