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


//appends to the DOM
myTuneApp.printResults = function (artistInfoArray){
    
    const $songList = $(".songList>ol");
    const $songImage = $(".songImage");

    $songList.empty();
    $songImage.empty();
    
    // nav'ed into artsit image array; used that to shorten the variable value of displayImage
    const imageArray = artistInfoArray[0]["image"];
    const displayImage = imageArray[imageArray.length - 1]["#text"];
    const artistName = artistInfoArray[0]["artist"]["name"];
    
    // append image   
    $songImage.append(`<img src="${displayImage}" alt="image of ${artistName}" class="${artistName}" >`);

    //append track results
    artistInfoArray.forEach((track) => {
        $songList.append(`<li class="track" data-artist="${track["artist"]["name"]}">${track["name"]}</li>`);
    });

    //append similar artists
};

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

    $(".songList").on("click", ".track", function() {

        const userClickName = $(this).text()
        const userClickArtist = $(this).attr("data-artist")

        myTuneApp.getTrackData(userClickName, userClickArtist)
    })
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
        this.printResults(results["similartracks"]["track"]);
    })

    .fail(() => {
        return null
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
        this.printResults(results["tracks"]["track"]);
    })

    .fail(() => {
        return null;
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

    .fail(() => {
        return null;
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
        this.printResults(results["tracks"]["track"])
    })

    .fail(() => {
        return null;
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
