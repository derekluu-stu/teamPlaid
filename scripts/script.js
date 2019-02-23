// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

//appends to the DOM
myTuneApp.printResults = function (artistInfoArray){
    
    const $songList = $(".songList>ol");
    const $songImage = $(".songImage");
    
    // nav'ed into artsit image array; used that to shorten the variable value of displayImage
    const imageArray = artistInfoArray[0]["image"];
    const displayImage = imageArray[imageArray.length - 1]["#text"];
    const artistInfo = artistInfoArray[0]["artist"];
    const artistName = artistInfo["name"];
    
    // append image   
    $songImage.append(`<img src="${displayImage}" alt="image of ${artistName}" class="${artistName}" >`);
    console.log(artistInfoArray)
    //append track results
    artistInfoArray.forEach((track) => {
        $songList.append(`<li class="track" data-artist="${track["artist"]["name"]}">${track.name}</li>`);
    });
}

// handle user text input & submit
myTuneApp.handleUserSearch = function (){

    $('header form').on('submit', (event) => {
        
        event.preventDefault();

        const $userInput = $('.searchBar>input[type="text"]');
        const $searchParameter = $('.searchFunction>input[name="searchParameter"]:checked');

        // search based on input value and search type selection
        if($userInput.val() && $searchParameter.attr("id") === "searchArtist"){
            this.getArtistData($userInput.val());

        } else if ($userInput.val() && $searchParameter.attr("id") === "searchGenre"){
            this.getGenreData($userInput.val());

        } else {
            return null;
        }

        $userInput.val("")
    });
};

// handle user click-search 
myTuneApp.handleClickSearch = function(){

    $(".songList").on("click", ".track", (event) => {

        const $userClick = event.target;

        myTuneApp.getTrackData($userClick.textContent, $userClick.getAttribute("data-artist"));
    })
};


// ERROR --> ? hard coded for test
// get tracks similar to user track slected by click 
// required info -> artst name, id, image, top tracks
myTuneApp.getTrackData = function (){

    $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: 'tracks.getsimilar',
            track: "the day",
            artist: "the roots",
            limit: 25,
            format: 'json'
        }
    })

    .then((results) => {
        // this.printResults(results["toptracks"]["track"]);
        console.log(results)
    })

    .fail((error) => {
        console.log(error);
    })
}

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
        this.printResults(results["tracks"]["track"]);
    })

    .fail((error) => {
        console.log(error)
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
        this.printResults(results["toptracks"]["track"]);
    })

    .fail((error) => {
        console.log(error)
    })
};

// gets data of top tracks in user area on page load; currently hard-coded to Canada
// required info -> artist name, id, image, top tracks
myTuneApp.getTopTracksByLocation = function() {

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
        this.printResults(results["tracks"]["track"])
    })

    .fail((error) => {
        console.log(error)
    })
};


myTuneApp.init = function() {

    this.getTopTracksByLocation();
    this.handleUserSearch();
    this.handleClickSearch();
};

$(function () {

    myTuneApp.init();
});