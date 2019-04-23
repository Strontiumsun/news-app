var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");

var PORT = 3000;
var db = require("./models");
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsApp", { useNewUrlParser: true });




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

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});