// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

// info to populate initial track and image data based on location
myTuneApp.initialSearchValues = [{
        api_key: myTuneApp.apiKey,
        method: "geo.gettoptracks",
        country: "Canada", // make a variable in the future with geo API?
        limit: 25,
        format: "json"
    },
    "tracks",
    "track"
];

// info to populate initial similar artist data based on location
myTuneApp.initialSimilarSearchValues = [{
        api_key: myTuneApp.apiKey,
        method: "geo.gettopartists",
        country: "Canada", // make variable in the future with geo API?
        limit: 25,
        format: "json"
    },
    "topartists",
    "artist"
];

// attempting to create something for error handeling
myTuneApp.errorResults = {
    images: [{
        "#text": "images/defaultimage.jpg"
    }],
    artist: {
        name: "Not A Valid Search"
    },
    name: "Not A Valid Search"
};


myTuneApp.init = function () {

    this.getData(myTuneApp.initialSearchValues);
    this.getSimilarData(myTuneApp.initialSimilarSearchValues);
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
        myTuneApp.getSimilarData(myTuneApp.organizeSimilarSearchInfo(searchData));

        $searchText.val("")
    });
};


myTuneApp.handleClickSearch = function(){

    $(".songList").on("click", "p", function () {

        const $selectedData = $(this).data();
        // organize search data into array; always send 1 parameter to function even with multiple values
        let searchData = [$selectedData]

        myTuneApp.getData(myTuneApp.organizeSearchInfo(searchData))
        myTuneApp.getSimilarData(myTuneApp.organizeSimilarSearchInfo(searchData));
    });

    $('.grid').on('click', '.artistCard', function () {
        
        const $selectedData = $(this).data();
        // organize search data into array; always send 1 parameter to function even with multiple values
        let searchData = [$selectedData]

        myTuneApp.getData(myTuneApp.organizeSearchInfo(searchData));
        myTuneApp.getSimilarData(myTuneApp.organizeSimilarSearchInfo(searchData));
        // myTuneApp.organizeSimilarSearchInfo(searchData)
    });
};

// organize search data pulled from data attribute tags
myTuneApp.organizeSearchInfo = function(searchData) {
    
    let data = {
        api_key: myTuneApp.apiKey,
        format: "json",
        limit: 25, // hardcoded 25 return limit -> create variable in future?
        autocorrect: 1
    }
    let returnValue;
    let arrayValue;

    for(let key in searchData[0]){

        if(key === "search"){
            data[searchData[0][key]] = searchData[1].val()

        } else if (key === "return") {
            returnValue = searchData[0][key]

        } else if (key === "array") {
            arrayValue = searchData[0][key]

        } else {
            data[key] = searchData[0][key]
        }
    }

    return [data, returnValue, arrayValue];
};

// organize search data pulled from data attribute tags
myTuneApp.organizeSimilarSearchInfo = function(searchData) {

    let data = {
        api_key: myTuneApp.apiKey,
        limit: 25,
        format: "json",
        autocorrect: 1
    }
    let returnValue = "similarartists";
    let arrayValue = "artist";

    for (let key in searchData[0]) {

        if (key === "search" && searchData[0][key] === "tag") {
            data["method"] = "tag.gettopartists"
            data["tag"] = searchData[1].val()
            returnValue = "topartists"
            arrayValue = "artist"

        } else if (key === "search" && searchData[0][key] === "artist") {
            data["method"] = "artist.getsimilar"
            data["artist"] = searchData[1].val()

        } else if (key === "artist"){
            data["method"] = "artist.getsimilar"
            data["artist"] = searchData[0]["artist"]
        }
    }
    
    return [data, returnValue, arrayValue];
};


// fetch data using last.fm API
myTuneApp.getData = function(data) {

    $.ajax({
        url: myTuneApp.apiUrl,
        data: data[0]
    })
    .then((results) => {
        myTuneApp.printResults(results[data[1]][data[2]])
    })
    .fail((error)=>{
        // myTuneApp.printResults(myTuneApp["errorResults"])
        console.log(error)
    })  
};

// fetch data  for similar artisr section using last.fm API
myTuneApp.getSimilarData = function(data) {
    
    $.ajax({
        url: myTuneApp.apiUrl,
        data: data[0]
    })
    .then((results) => {
        myTuneApp.appendSimilarArtists(results[data[1]][data[2]])
    })
    .fail((error) => {
        myTuneApp.appendSimilarArtists(myTuneApp["errorResults"])
    })  
}


// appends to the DOM
myTuneApp.printResults = function (artistInfoArray) {
    
    // append main image
    this.appendImage(artistInfoArray)

    //append track results
    this.appendTopTracks(artistInfoArray)
};


// append images to DOM
myTuneApp.appendImage = function (artistInfoArray) {
    
    const {image, artist} = artistInfoArray[0];

    const $songImage = $(".songImage");
    
    $songImage.empty();

    $songImage.append(`<img src="${image[image.length - 1]['#text']}" alt="image of ${artist['name']}">`);
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
            .attr(`data-array`, `track`)

        // appends artist name --> links to artist.gettoptracks
        $("<p/>").text(`${track["artist"]["name"]}`).appendTo($newLi)
            .attr(`data-method`, `artist.gettoptracks`)
            .attr(`data-artist`, `${track["artist"]["name"]}`)
            .attr(`data-return`, `toptracks`)
            .attr(`data-array`, `track`)

        $newLi.appendTo($songList);
    });
};


//appends similar artists to the DOM
myTuneApp.appendSimilarArtists = function (similarArtistArray) {
    
    $('.grid').empty();

    similarArtistArray.forEach((currentArtist) => {

        const {image, name} = currentArtist
        
        const $newLi = $("<li>")
            .addClass("artistCard")
            .attr(`data-artist`, `${name}`)
            .attr(`data-method`, `artist.gettoptracks`)
            .attr(`data-return`, `toptracks`)
            .attr(`data-array`, `track`)

        $(`<img src="${image[2]['#text']}" alt="Image of ${name}">`).appendTo($newLi)

        $("<p>").text(`${name}`).appendTo($newLi)

        $('.grid').append($newLi)
    });
};