// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

//appends to the DOM
myTuneApp.printResults = function (infoResults, trackResults, searchType){
    // use searchType to determine where to find artist name data
    //infoResults - returns the artist name and the image
    //trackResults - returns track list (same for every method)

    const $songList = $(".songList>ol");
    const $songImage = $(".songImage");
    
    // empty display containers
    $songList.empty();
    $songImage.empty();
    
    if (searchType === 'multiSearch'){

        console.log(trackResults);

        const artistName = trackResults[0]["artist"]["name"]
        const image = infoResults["image"][infoResults["image"].length - 1]["#text"]; 

        $songImage.append(`<img src="${image}" alt="Image of ${artistName}">`);
        
        trackResults.forEach((track) => {
            $songList.append(`<li class="track" data-artist="${track.artist.name}">${track.name}</li>`);
        });
        
    } else if (searchType === 'singleSearch') {

        const image  = infoResults["image"][infoResults["image"].length - 1]["#text"];

        const artistName = infoResults["name"];

        const trackArray = trackResults.toptracks.track;

        $songImage.append(`<img src="${image}" alt="Image of ${artistName}">`);
        
        trackArray.forEach((track) => {
            $songList.append(`<li class="track" data-artist="${artistName}">${track.name}</li>`);
        });

        
    
    } else if (searchType === 'initial'){
        
        const image = infoResults[0]["image"][infoResults[0]["image"].length - 1]["#text"];
        const artistName = infoResults[0].artist.name;
        
        const artistsArray = trackResults.map((tracks) => {
            return tracks.artist.name;
        });
        const tracksArray = trackResults.map((tracks) => {
            return tracks.name;
        });
        
        $songImage.append(`<img src="${image}" alt="Image of ${artistName}">`);
        
        for (i = 0; i < trackResults.length - 1; i++){
            $songList.append(`<li class="track" data-artist="${artistsArray[i]}">${tracksArray[i]}</li>`);
        };
    };
}
    //top artists by genre 
    // const similarArtistsGenre = results3.topartists.artist


// get user input
myTuneApp.handleUserSearch = function (){

    $('header form').on('submit', (event) => {
        event.preventDefault();

        const $userInput = $('.searchBar>input[type="text"]');
        const $searchParameter = $('.searchFunction>input[name="searchParameter"]:checked');

        // search based on input value and search type selection
        if($userInput.val().length > 0 && $searchParameter.attr("id") === "searchArtist"){
            this.getArtistData($userInput.val());

        } else if ($userInput.val().length > 0 && $searchParameter.attr("id") === "searchGenre"){
            this.getGenreData($userInput.val());
        }

        $userInput.val("")
    });
};

myTuneApp.handleClickSearch = function(){

    $(".songList").on("click", ".track", (event) => {

        console.log("clicked");

        const $userClick = event.target;
        myTuneApp.getTrackData($userClick.textContent, $userClick.getAttribute("data-artist"));
    })
};

myTuneApp.getTrackData = function (userTrackQuery, userArtistQuery){

    console.log("sending search query");
    console.log(userTrackQuery, userArtistQuery);

    const getTrackInfo = $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: myTuneApp.apiKey,
            method: 'track.getsimilar',
            track: userTrackQuery,
            artist: userArtistQuery,
            limit: 25,
            format: 'json'
        }
    })

    .then((results) => {
        // myTuneApp.printResults(results["tracks"]["track"][0], results["tracks"]["track"], "multiSearch")
        console.log(results);
    })

    .fail((error) => {
        console.log("error");
    })
}


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
        
        myTuneApp.printResults(results["tracks"]["track"][0], results["tracks"]["track"], "multiSearch")
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

        myTuneApp.printResults(infoResults[0]["artist"], trackResults[0], "singleSearch")
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
        myTuneApp.printResults(results["tracks"]["track"], results["tracks"]["track"], "initial");
    })
};


myTuneApp.init = function() {

    this.getInitialData();
    this.handleUserSearch();
    this.handleClickSearch();
};

$(function () {

    myTuneApp.init();
});