// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

myTuneApp.initialSearchValues = [{
    api_key: myTuneApp.apiKey,
    method: "geo.gettoptracks",
    country: "Canada", // make a variable in the future with geo API?
    limit: 25,
    format: "json"
    },
    "tracks"
];

myTuneApp.errorResults;

myTuneApp.handleSimilarArtistsClickSearch = function () {

    $('.grid').on('click', 'li', function (){
        const artistName = $(this).attr("data-artist");
        myTuneApp.getArtistData(artistName);
    })
}

//appends similar artists to the DOM
myTuneApp.printSimilarArtists = function (similarArtistArray) {

    
    const $displayImage = similarArtistArray[0]["image"][similarArtistArray[0]["image"].length -1]["#text"];
    const $artistName = similarArtistArray[0].name;
    
    myTuneApp.appendImages($displayImage, $artistName);
    
    $('.grid').empty();
    
    similarArtistArray.forEach((artist) => {
        $('.grid').append(`<li data-artist="${artist.name}">${artist.name}</li>`);
    });

}

// // handle user text input & submit
// myTuneApp.handleUserSearch = function () {

//     $('header form').on('submit', (event) => {

//         event.preventDefault();

//         const $userInput = $('.searchBar>input[type="text"]');
//         const $searchParameter = $('.searchSelector>input[name="searchParameter"]:checked');

//         // search based on input value and search type selection
//         if ($userInput.val().length > 0 && $searchParameter.attr("id") === "searchArtist") {
//             this.getArtistData($userInput.val());
//             //need async here, wait for artistData before printing similarArtistData
//             this.artistGetSimilarArtist($userInput.val());

//         } else if ($userInput.val().length > 0 && $searchParameter.attr("id") === "searchGenre") {
//             this.getGenreData($userInput.val());
//             this.genreGetSimilarArtist($userInput.val());

//         } else {
//             return null
//         }

//         $userInput.val("")
//     });
// };

// // handle user click-search 
// myTuneApp.handleClickSearch = function () {

//     $(".songList").on("click", "p", function () {

//         const $selectedType = $(this).attr("data-type");
//         const $selectedTitle = $(this).attr("data-title");
//         const $selectedArtist = $(this).attr("data-artist");

//         if ($selectedType === "track") {
//             myTuneApp.getTrackData($selectedTitle, $selectedArtist)

//         } else if ($selectedType === "artist") {
//             myTuneApp.getArtistData($selectedArtist)
//         }
//     })
// };

// //appends to the DOM
// myTuneApp.printResults = function (artistInfoArray, searchTitle, searchType){
    
//     // deconstruct artistInfoArray into needed pieces
//     const {image, artist} = artistInfoArray[0]
//     const displayImage = image[image.length - 1]["#text"];
//     const artistName = artist["name"];
    
//     // append image   
//     this.appendImages(displayImage, artistName);
//     this.appendRelatedInfo(searchTitle, searchType)

//     //append track results
//     this.appendTopTracks(artistInfoArray)
// };

// // append related info to search
// myTuneApp.appendRelatedInfo = function(searchTitle, searchType){

//     const $infoText = $(".infoText")
//     const $infoTitle = $(".infoTitle")
//     let inset;

//     if (searchType === "artist"){
//         insert = "by"
//     } else if (searchType === "track"){
//         insert = "Related To"
//     } else if (searchType === "location"){
//         insert = "in"
//     } else if (searchType === "genre"){
//         insert = "Tagged As"
//     }

//     $infoTitle.text(`Top Tracks ${insert}`);
//     $infoText.text(searchTitle);
// };

// // append images to DOM
// myTuneApp.appendImages = function(displayImage, artistName){

//     const $songImage = $(".songImage");

//     $songImage.empty();
//     $songImage.append(`<img src="${displayImage}" alt="image of ${artistName}" class="${artistName}" >`);
// };

// // append top tracks to DOM
// myTuneApp.appendTopTracks = function(artistInfoArray) {

//     const $songList = $(".songList>ol");

//     $songList.empty();

//     artistInfoArray.forEach((track) => {

//         const $newLi = $("<li/>").addClass(`track flexRow`)

//         $("<p/>").text(`${track["name"]}`).appendTo($newLi)
//             .attr(`data-type`, `track`)
//             .attr(`data-title`, `${track["name"]}`)
//             .attr(`data-artist`, `${track["artist"]["name"]}`)

//         $("<p/>").text(`${track["artist"]["name"]}`).appendTo($newLi)
//             .attr(`data-type`, `artist`)
//             .attr(`data-artist`, `${track["artist"]["name"]}`)

//         $newLi.appendTo($songList);

//         // $songList.append(`<li class="track" data-artist="${track["artist"]["name"]}">${track["name"]}</li>`);
//     });
// };

// // get tracks similar to user track slected by click 
// // returned info -> artst name, id, image, top tracks
// myTuneApp.getTrackData = function (trackInfo, artistInfo){
    
//     $.ajax({
//         url: myTuneApp.apiUrl,
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: 'track.getsimilar',
//             track: trackInfo,
//             artist: artistInfo,
//             limit: 25,
//             format: 'json'
//         }
//     })

//     .then((results) => {
//         this.printResults(results["similartracks"]["track"], `${trackInfo} - ${artistInfo}`, "track");
//     })

//     .fail((error) => {
//         console.log(error)
//     })
// };

// // get searched genre info -> artst name, id, image, top tracks
// myTuneApp.getGenreData = function (genreQuery){

//     //returns name of track, artist and image of artist
//     $.ajax({
//         // URL and Method are always stated outside of the data object (in jquery docs)
//         // No method used here, due to the nature of the API
//         url: myTuneApp.apiUrl,
//         // data is the object of parameters, sent as a query string in a "GET" method 
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: 'tag.getTopTracks',
//             tag: genreQuery,
//             limit: 25,
//             format: 'json'
//         }
//     })

//     .then((results) => {
//         this.printResults(results["tracks"]["track"], genreQuery, "genre");
//     })

//     .fail((error) => {
//         console.log(error);
//     })
// };

// // get searched artist info -> artst name, id, image, top tracks
// myTuneApp.getArtistData = function(artistQuery){

 
//     $.ajax({
//         url: myTuneApp.apiUrl,
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: "artist.gettoptracks",
//             artist: artistQuery,
//             limit: 25,
//             format: "json"
//         }
//     })

//     .then((results) => {
//         this.printResults(results["toptracks"]["track"], artistQuery, "artist");
//     })

//     .fail((error) => {
//         console.log(error);
//     })
// };

// // gets data of top tracks in user area on page load; currently hard-coded to Canada
// // returned info -> artist name, id, image, top tracks
// myTuneApp.getTopTracksByLocation = function(){

//     $.ajax({
//         url: myTuneApp.apiUrl,
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: "geo.gettoptracks",
//             country: "Canada", // make a variable in the future with geo API?
//             limit: 25,
//             format: "json"
//         }
//     })

//     .then((results) => {
//         this.printResults(results["tracks"]["track"], "Canada", "location") // pass location vaariable here
//     })

//     .fail((error) => {
//         console.log(error);
//     })
// };


// //  //how many returns do we have on average?

// //search by artist
// myTuneApp.artistGetSimilarArtist = function (artistInfo) {

//     $.ajax({
//         url: myTuneApp.apiUrl,
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: "artist.getsimilar",
//             artist: artistInfo, 
//             limit: 25,
//             format: "json"
//         }
//     })

//         .then((results) => {
//             myTuneApp.printSimilarArtists(results.similarartists.artist);
//             //pass array of artists
//         })

//         .fail(() => {
//             return null;
//         })
// };

// //search similar artists by genre
// myTuneApp.genreGetSimilarArtist = function (genre) {

//     $.ajax({
//         url: myTuneApp.apiUrl,
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: "tag.getTopArtists",
//             format: "json",
//             tag: genre, 
//             limit: 25
//         }
//     })

//         .then((results) => {
//             myTuneApp.printSimilarArtists(results.topartists.artist);
//             //pass the array of artists
//         })

//         .fail(() => {
//             return null;
//         })
// };

// //initial 
// myTuneApp.getSimilarArtistsByLocation = function () {

//     $.ajax({
//         url: myTuneApp.apiUrl,
//         data: {
//             api_key: myTuneApp.apiKey,
//             method: "geo.getTopArtists",
//             format: "json",
//             country: "Canada",
//             limit: 25
//         }
//     })

//         .then((results) => {
//             myTuneApp.printSimilarArtists(results.topartists.artist);
//             //pass the array of artists
//         })

//         .fail(() => {
//             return null;
//         })
// };
//     //put it in init
//     //create seperate function for similarArtists
//     //geo.gettopartists
//         //name results.topartists.artist
//             //[index].name



myTuneApp.init = function () {

    // this.getTopTracksByLocation();
    // this.handleUserSearch();
    // this.handleClickSearch();
    // this.handleSimilarArtistsClickSearch();

    this.getData(myTuneApp.initialSearchValues);
    this.handleTextSearch();
    this.handleClickSearch();
};


$(function () {

    myTuneApp.init();
});


myTuneApp.handleTextSearch = function() {

    $("input[type='submit']").on("click", function(event) {

        event.preventDefault()

        const $searchText = $("input[type='text']");
        const $selectedData = $("input[type='radio']:checked").data();
        // organize search data into array; always send 1 parameter to function even with multiple values
        let searchData = [$selectedData, $searchText]
        
        myTuneApp.getData(myTuneApp.organizeSearchInfo(searchData))
    });
};


myTuneApp.handleClickSearch = function(){

    $(".songList").on("click", "p", function () {

        const $selectedData = $(this).data();
        // organize search data into array; always send 1 parameter to function even with multiple values
        let searchData = [$selectedData]

        myTuneApp.getData(myTuneApp.organizeSearchInfo(searchData))
    })
}

// organize search data pulled from data attribute tags
myTuneApp.organizeSearchInfo = function(searchData) {

    let data = {
        api_key: myTuneApp.apiKey,
        format: "json",
        limit: 25, // hardcoded 25 return limit -> create variable in future?
    }
    let returnValue;

    for(let key in searchData[0]){

        if(key === "search"){
            data[searchData[0][key]] = searchData[1].val()

        } else if (key === "return") {
            returnValue = searchData[0][key]

        } else {
            data[key] = searchData[0][key]
        }
    }
    
    return [data, returnValue];
};


// fetch data using last.fm API
myTuneApp.getData = function(data) {
    console.log(data[1])
    $.ajax({
        url: myTuneApp.apiUrl,
        data: data[0]
    })
    .then((results) => {
        myTuneApp.printResults(results[data[1]]["track"])
    })
    .fail((error)=>{
        console.log(error)
    })
};


// appends to the DOM
myTuneApp.printResults = function (artistInfoArray){

    // deconstruct artistInfoArray into needed pieces
    const {image, artist} = artistInfoArray[0]
    const displayImage = image[image.length - 1]["#text"];
    const artistName = artist["name"];

    // append main image
    this.appendImages(displayImage, artistName)

    // append related info
    // this.appendRelatedInfo()

    //append track results
    this.appendTopTracks(artistInfoArray)

    // appendSimilarArtists
    this.appendSimilarArtists(artistInfoArray)
};


// append images to DOM
myTuneApp.appendImages = function (displayImage, artistName) {

    const $songImage = $(".songImage");

    $songImage.empty();

    $songImage.append(`<img src="${displayImage}" alt="image of ${artistName}">`);
};


// append top tracks to DOM
myTuneApp.appendTopTracks = function(artistInfoArray) {
    
    const $songList = $(".songList>ol");

    $songList.empty();

    artistInfoArray.forEach((track) => {

        const $newLi = $("<li/>").addClass(`track flexRow`)

        // append track title --> links to track.getsimilar
        $("<p/>").text(`${track["name"]}`).appendTo($newLi)
            .attr(`data-method`, `track.getsimilar`)
            .attr(`data-track`, `${track["name"]}`)
            .attr(`data-artist`, `${track["artist"]["name"]}`)
            .attr(`data-return`, `similartracks`)

        // appends artist name --> links to artist.gettoptracks
        $("<p/>").text(`${track["artist"]["name"]}`).appendTo($newLi)
            .attr(`data-method`, `artist.gettoptracks`)
            .attr(`data-artist`, `${track["artist"]["name"]}`)
            .attr(`data-return`, `toptracks`)

        $newLi.appendTo($songList);
    });
};

myTuneApp.handleSimilarArtistsClickSearch = function () {

    $('.grid').on('click', 'li', function () {
        const artistName = $(this).attr("data-artist");
        myTuneApp.getArtistData(artistName);
    })
}

//appends similar artists to the DOM
myTuneApp.appendSimilarArtists = function (similarArtistArray) {


    const $displayImage = similarArtistArray[0]["image"][similarArtistArray[0]["image"].length - 1]["#text"];
    const $artistName = similarArtistArray[0].name;

    myTuneApp.appendImages($displayImage, $artistName);

    $('.grid').empty();

    similarArtistArray.forEach((artist) => {
        $('.grid').append(`<li>${artist.name}</li>`)
            .attr(`data-artist`=`${artist.name}`);
    });

}