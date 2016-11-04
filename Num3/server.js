/**
 * Created by kaya on 11/3/16.
 */
var express = require('express');
var http = require('http');
var app = express();

/*app.use("/", function (req, res){
    console.log("in app.use /")
    var tmp = req.query.;
    console.log(tmp);

});*/
app.use('/endpoint', function(request, response) {
    console.log('in endpoint');
    var color = request.query.color;
    var id = request.query.id;
    console.log(request.query);
    response.end("I have received the ID: " + color);
});

app.listen(3000);
console.log("node express app started at http://localhost:3000");


//var port = 8080;
//app.listen(port ,function () {
  //  console.log("Serve is running @ http://127.0.0.1:"+port);
//});
//http://localhost:3000/endpoint?id=something
