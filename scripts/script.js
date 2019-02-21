// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl =  "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey =  "ad9364740e28729d2afec7f390614ec2";

//appends to the DOM
myTuneApp.printResults = function (results1, results2){
    console.log(results1, results2);
    results2.forEach((track) => console.log(track.name))
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
            api_key: "ad9364740e28729d2afec7f390614ec2",
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
            api_key: "ad9364740e28729d2afec7f390614ec2",
            method: "artist.gettoptracks",
            artist: userArtistQuery,
            limit: 25,
            format: "json"
        }
    })

    $.when(getArtistInfo, getArtistTracks)
    .then((infoResults, trackResults) => {
        // myTuneApp.printResults(getArtistInfo.artist, getArtistTracks.toptracks);
        myTuneApp.printResults(getArtistInfo.responseJSON.artist, getArtistTracks.responseJSON.toptracks.track);
    })
    .fail((error) => {
        console.log(error)
    })
};


myTuneApp.init = function() {

    this.handleUserSearch();
    // this.getArtistData();

};

$(function() {

    myTuneApp.init();
})