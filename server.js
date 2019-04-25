var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
var path = require("path");

var PORT = 3000;
var db = require("./models");
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nintendoNewsApp";

mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/nintendoNewsApp", { useNewUrlParser: true });


app.get("/scrape", function (req, res) {

    axios.get("http://www.nintendolife.com/news").then(function (response) {

        var $ = cheerio.load(response.data);

        $("li.item-medium").each(function (i, element) {

            var results = {};

            results.title = $(element).children().find("p.heading").text();
            results.link = "http://www.nintendolife.com/" + $(element).children().find("p.heading>a").attr("href");
            results.description = $(element).children().find("p.description").text();


            db.News.create(results).then(function (dbNews) {
                console.log(dbNews);

            }).catch(function (err) {
                console.log(err);
            });


        })


    })

    console.log("Scrape Complete!");
    res.redirect("/");

})

app.get("/news", function (req, res) {

    db.News.find({ saved: false }, function (err, data) {
        res.json(data)
    })

})

app.get("/saved", function (req, res) {
    res.sendFile(path.join(__dirname, "public/saved.html"));
})

app.get("/savednews", function (req, res) {
    db.News.find({ saved: true }, function (err, data) {
        res.json(data)
    })
})

app.get("/saved/:id", function (req, res) {
    chosenId = req.params.id

    db.News.findByIdAndUpdate({ _id: chosenId }, { saved: true }).then(function (dbNews) {
        res.redirect(`/`);
    })

})

app.get("/unsaved/:id", function (req, res) {
    chosenId = req.params.id

    db.News.findByIdAndUpdate({ _id: chosenId }, { saved: false }).then(function (dbNews) {

    })

})

app.get("/news/:id", function (req, res) {
    chosenId = req.params.id
    db.News.findById(chosenId).populate("note").then(function (dbNews) {

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

app.get("/deleted/:id", function (req, res) {
    chosenId = req.params.id

    db.Notes.findOneAndRemove({ _id: chosenId }, function (err, data) {
        if (err) throw err;
        res.json(data);
    })
})


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});