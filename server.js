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


app.get("/scrape", function (req, res) {

    axios.get("https://www.reddit.com/r/splatoon/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("span.y8HYJ-y_lTUHkQIc1mdCq").each(function (i, element) {

            var results = {};

            results.link = "https://www.reddit.com" + $(element).children().attr("href");
            results.title = $(element).children().find("h2").text();


            db.News.create(results).then(function (dbNews) {
                console.log(dbNews);

            }).catch(function (err) {
                console.log(err);
            });

            // var link = $(element).children().attr("href");
            // var title = $(element).children().find("h2").text();

            // results.push({
            //     title: title,
            //     link: "https://www.reddit.com" + link
            // });


        })
        console.log("Scrape Complete!");

    })



})

app.get("/news", function (req, res) {

    db.News.find({}, function (err, data) {
        res.json(data)
    })

})

app.get("/news/:id", function (req, res) {
    chosenId = req.params.id
    db.News.findById(chosenId).populate("note").then(function (dbNews) {
        res.json(dbNews)
    })

})

app.post("/news/:id", function (req, res) {
    chosenId = req.params.id

    db.Notes.create(req.body)
        .then(function (dbNotes) {
            return db.News.findOneAndUpdate({ _id: chosenId }, { note: dbNotes._id }, { new: true });

        }).then(function (dbNews) {
            res.json(dbNews)
        }).catch(function (err) {
            res.json(err);
        });

})



app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});