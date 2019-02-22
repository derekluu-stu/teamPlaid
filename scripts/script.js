// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl =  "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey =  "ad9364740e28729d2afec7f390614ec2";

//appends to the DOM
myTuneApp.printResults = function (results1, results2){
// myTuneApp.printResults = function (results1, results2, searchType){
    
    const $songList = $(".songList>ol");
    const $songImage = $(".songImage");              

    $songList.empty();
    $songImage.empty();
    // result1 image append
    // for tags, result.tracks.track is an array. "image" is key which holds the array
    // for artists results.artist is object. "image" is key which holds the array
    //** implement an if statement of length of array (result.track.tracks) is 25 to catch the genre requests (we set results limited to 25), 
        //push the artist name and image as an object to an array (syncs image with song name) append when user switches songs (findIndex). empty array at the start of each code block before pushing a new array
        
    const image = results1.image[results1.image.length - 1]["#text"]
    
    $songImage.append(`<img src="${image}">`);
   

    // results2 will always be song names
    // **this is the song for tags 
    results2.forEach((track) => {
        $songList.append(`<li>${track.name}</li>`)
    });

    //top artists by genre 
    // const similarArtistsGenre = results3.topartists.artist
}

// get user input
myTuneApp.handleUserSearch = function (){
    $('header form').on('submit', (e) => {
        e.preventDefault();

        const userInput = $('.searchBar>input[type="text"]').val();

        this.getArtistData(userInput);
        // this.getGenreData(userInput);
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
    // const getArtistTracks = $.ajax({
    //     url: myTuneApp.apiUrl,
    //     data: {
    //         api_key: myTuneApp.apiKey,
    //         method: "artist.gettoptracks",
    //         artist: userArtistQuery,
    //         limit: 25,
    //         format: "json"
    //     }
    // })

    // $.when(getArtistInfo, getArtistTracks)
    // .then((infoResults, trackResults) => {
    //     // myTuneApp.printResults(getArtistInfo.artist, getArtistTracks.toptracks);
    //     myTuneApp.printResults(getArtistInfo.responseJSON.artist, getArtistTracks.responseJSON.toptracks.track, "searchQuery");
    // })
    // .fail((error) => {
    //     console.log(error)
    // })
    .then((results) => {
        console.log(results);
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

    // this.getInitialData();
    this.handleUserSearch();

};

$(function() {

    myTuneApp.init();
})