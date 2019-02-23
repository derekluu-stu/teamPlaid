// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

//appends similar artists to the DOM
myTuneApp.printSimilarArtists = function (similarArtistArray) {

    similarArtistArray.forEach((artist) => {
        $('.flexColumn>ul').append(`<li>${artist.name}</li>`);
    });
}

// handle user text input & submit
myTuneApp.handleUserSearch = function () {

    $('header form').on('submit', (event) => {

        event.preventDefault();

        const $userInput = $('.searchBar>input[type="text"]');
        const $searchParameter = $('.searchSelector>input[name="searchParameter"]:checked');

        // search based on input value and search type selection
        if ($userInput.val().length > 0 && $searchParameter.attr("id") === "searchArtist") {
            this.getArtistData($userInput.val());

        } else if ($userInput.val().length > 0 && $searchParameter.attr("id") === "searchGenre") {
            this.getGenreData($userInput.val());

        } else {
            return null
        }

        $userInput.val("")
    });
};

// handle user click-search 
myTuneApp.handleClickSearch = function () {

    $(".songList").on("click", ".track", function () {

        const userClickName = $(this).text()
        const userClickArtist = $(this).attr("data-artist")

        myTuneApp.getTrackData(userClickName, userClickArtist)
    })
};

//appends to the DOM
myTuneApp.printResults = function (artistInfoArray, searchTitle, searchType){
    
    // deconstruct artistInfoArray into needed pieces
    const {image, artist} = artistInfoArray[0]
    const displayImage = image[image.length - 1]["#text"];
    const artistName = artist["name"];
    
    // append image   
    this.appendImages(displayImage, artistName);
    this.appendRelatedInfo(searchTitle, searchType)

    //append track results
    this.appendTopTracks(artistInfoArray)
};

// append related info to search
myTuneApp.appendRelatedInfo = function(searchTitle, searchType){

    const $infoText = $(".infoText")
    const $infoTitle = $(".infoTitle")
    let inset;

    if (searchType === "artist"){
        insert = "by"
    } else if (searchType === "track"){
        insert = "Related To"
    } else if (searchType === "location"){
        insert = "in"
    } else if (searchType === "genre"){
        insert = "Tagged As"
    }

    $infoTitle.text(`Top Tracks ${insert}`);
    $infoText.text(searchTitle);
};

// append images to DOM
myTuneApp.appendImages = function(displayImage, artistName){

    const $songImage = $(".songImage");

    $songImage.empty();
    $songImage.append(`<img src="${displayImage}" alt="image of ${artistName}" class="${artistName}" >`);
};

// append top tracks to DOM
myTuneApp.appendTopTracks = function(artistInfoArray) {

    const $songList = $(".songList>ol");

    $songList.empty();

    artistInfoArray.forEach((track) => {
        $songList.append(`<li class="track" data-artist="${track["artist"]["name"]}">${track["name"]}</li>`);
    });
};

// get tracks similar to user track slected by click 
// returned info -> artst name, id, image, top tracks
myTuneApp.getTrackData = function (trackInfo, artistInfo){
    
    $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: 'track.getsimilar',
            track: trackInfo,
            artist: artistInfo,
            limit: 25,
            format: 'json'
        }
    })

    .then((results) => {
        this.printResults(results["similartracks"]["track"], `${trackInfo}: ${artistInfo}`, "track");
    })

    .fail((error) => {
        console.log(error)
    })
};

// get searched genre info -> artst name, id, image, top tracks
myTuneApp.getGenreData = function (genreQuery){

    //returns name of track, artist and image of artist
    $.ajax({
        // URL and Method are always stated outside of the data object (in jquery docs)
        // No method used here, due to the nature of the API
        url: myTuneApp.apiUrl,
        // data is the object of parameters, sent as a query string in a "GET" method 
        data: {
            api_key: myTuneApp.apiKey,
            method: 'tag.getTopTracks',
            tag: genreQuery,
            limit: 25,
            format: 'json'
        }
    })

    .then((results) => {
        this.printResults(results["tracks"]["track"], genreQuery, "genre");
    })

    .fail((error) => {
        console.log(error);
    })
};

// get searched artist info -> artst name, id, image, top tracks
myTuneApp.getArtistData = function(artistQuery){

 
    $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: "artist.gettoptracks",
            artist: artistQuery,
            limit: 25,
            format: "json"
        }
    })

    .then((results) => {
        this.printResults(results["toptracks"]["track"], artistQuery, "artist");
    })

    .fail((error) => {
        console.log(error);
    })
};

// gets data of top tracks in user area on page load; currently hard-coded to Canada
// returned info -> artist name, id, image, top tracks
myTuneApp.getTopTracksByLocation = function(){

    $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: "geo.gettoptracks",
            country: "Canada", // make a variable in the future with geo API?
            limit: 25,
            format: "json"
        }
    })

    .then((results) => {
        this.printResults(results["tracks"]["track"], "Canada", "location") // pass location vaariable here
    })

    .fail((error) => {
        console.log(error);
    })
};

myTuneApp.init = function(){    

    this.getTopTracksByLocation();
    this.artistGetSimilar();
    this.handleUserSearch();
    this.handleClickSearch();
};

$(function (){

    myTuneApp.init();
});

//  //how many returns do we have on average?

//search by artist
    //put it in handleUserSearch
    //artist.getSimilar
        //name = results.similarartists.artist
            //[index].name

myTuneApp.artistGetSimilar = function () {

    $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: "artist.getsimilar",
            artist: "Adele", 
            limit: 25,
            format: "json"
        }
    })

        .then((results) => {
            myTuneApp.printSimilarArtists(results.similarartists.artist);
        })

        .fail(() => {
            return null;
        })
};

//search by genre
    //put it in handleUserSearch
    //tag.getTopArtists
        //name results.topartists.artist
            //[index].name

//initial load
    //put it in init
    //create seperate function for similarArtists
    //geo.gettopartists
        //name results.topartists.artist
            //[index].name
