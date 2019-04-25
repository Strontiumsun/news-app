// Grab the articles as a json
$.getJSON("/news", function (data) {
    // For each one
    for (var i = 0; i < 6; i++) {
        // Display the apropos information on the page

        $("#articles")
            .append(`<p data-id=${data[i]._id}>
        <h2>${data[i].title}</h3>
        
        <h4>${data[i].description}</h4>
       
        <a href=${data[i].link}>Read More</a>
        </p>
        <button class='saved' data-id=${data[i]._id}>Save Article</button>`);
        //"<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].description + "</p>" + `<button class='saved' data-id=${data[i]._id}>Save Article</button>`
    }
});



$(document).on("click", "button.saved", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/saved/" + thisId
    }).then(function (err, data) {
        if (err) throw err;

        console.log("saved")

    })

})

