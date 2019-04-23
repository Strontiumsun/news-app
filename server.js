var cheerio = require("cheerio");
var axios = require("axios");

console.log("\n***********************************\n" +
    "My attempt 2\n" +
    "from the Splatoon reddit:" +
    "\n***********************************\n");

axios.get("https://www.reddit.com/r/splatoon/").then(function (response) {
    var $ = cheerio.load(response.data);

    var results = [];

    $("span.y8HYJ-y_lTUHkQIc1mdCq").each(function (i, element) {
        var link = $(element).children().attr("href");
        var title = $(element).children().find("h2").text();

        results.push({
            title: title,
            link: "https://www.reddit.com" + link
        });


    })

    console.log(results);


})

//div.LatestSection__listContainer____3lMZ4
//var title = $(element).children().attr("h3");
// var link = $(element).children().attr("href");

// var title = $(element).find("div").find("div").find("div").find("h3");