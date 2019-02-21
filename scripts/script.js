// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl =  "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey =  "ad9364740e28729d2afec7f390614ec2";

//appends to the DOM
myTuneApp.printResults = function (results1, results2, searchType){
    
    const $songList = $(".songList>ol");
    const $songImage = $(".songImage");

    $songList.empty();
    $songImage.empty();
    // result1 image append
    const image = results1["image"][results1["image"].length - 1]["#text"]
   

    // results2 will always be song names
    results2.forEach((track) => {
        $songList.append(`<li>${track.name}</li>`)
    });
}


// get user input
myTuneApp.handleUserSearch = function (){
    $('header form').on('submit', (e) => {
        e.preventDefault();

        const userInput = $('.searchBar>input[type="text"]').val();

        this.getArtistData(userInput);
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
        // myTuneApp.printResults(getArtistInfo.artist, getArtistTracks.toptracks);
        myTuneApp.printResults(getArtistInfo.responseJSON.artist, getArtistTracks.responseJSON.toptracks.track, "searchQuery");
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
        myTuneApp.printResults(results["tracks"]["track"][0], 
        results["tracks"]["track"], "initial");
    })
}


myTuneApp.init = function() {

    this.getInitialData();
    this.handleUserSearch();

};

$(function() {

    myTuneApp.init();
})