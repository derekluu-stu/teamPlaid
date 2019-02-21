// project parent object
const myTuneApp = {};

// api call required info
myTuneApp.apiUrl = "http://ws.audioscrobbler.com/2.0/";
myTuneApp.apiKey = "ad9364740e28729d2afec7f390614ec2";

// searchQuery parameter: artist or genre name
// searchType parameter: user selected artist or genre search style
myTuneApp.getArtistData = function (userArtistQuery) {
    $.ajax({
        url: myTuneApp.apiUrl,
        data: {
            api_key: "ad9364740e28729d2afec7f390614ec2",
            method: "artist.getsimilar",
            artist: userArtistQuery,
            format: "json"
        }
    })
        .then((results) => {
            console.log(results)
        })
        .fail((error) => {
            console.log(error)
        })
};

myTuneApp.init = function () {

    this.getArtistData("Pink Floyd");
};

$(function () {

    myTuneApp.init();
})