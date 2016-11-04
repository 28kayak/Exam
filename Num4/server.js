/**
 * Created by kaya on 11/3/16.
 */
var express = require('express');


var app = express();
var port = 8080;
var products = [{"name" : "ipad", "amount": 6}];
var numOfAmount = 0;
var sales = 0;


function addstock(addedProdct){

    console.log("added: " + JSON.stringify(addedProdct));

    //var index = 0;

    console.log("Length = " + products.length);
    var treated = false;
    for(index in products )
    {
        console.log("product name  =" + products[index].name);
        console.log("added product = " + addedProdct.name);
        console.log("check index   = " +index);
        if (JSON.stringify(products[index].name) === JSON.stringify(addedProdct.name)) {
            //console.log("additional amount: " + parseInt( addedProdct.amount));
            //console.log("current amount : " + parseInt(prodcuts[0].amount) );
            console.log("==================there is identical product==================");
            var additional = parseInt(addedProdct.amount);
            var current = parseInt(products[index].amount);
            var newAmount = 0;
            newAmount = current + additional;
            products[index].amount = newAmount;
            //console.log("total: product = " + products[index].amount);
            showCurrentStocker();
            treated = true;
            console.log("===========================================================");

        }
        else {
            console.log("Some thing wrong");
        }
    }//for
    if(!treated)
    {
        //if addition is already treated
        console.log("==================New product is inserted==================");
        products.push(addedProdct);
        showCurrentStocker();
        console.log("===========================================================");
    }
      // index++;

    







}
function showCurrentStocker() {
    console.log("============SHOW Current products========");
    console.log(products);
    console.log("=========================================");
}



app.use('/stocker', function (req, res) {
    console.log('in add stock');
    //console.log('in endpoint');
    //var color = req.query.color;
    var f = req.query.function;
    console.log(req.query);

    var productInfo = {"name": req.query.name, "amount": req.query.amount};
    var p = {"name" : "ipad", "amount":8};
    addstock(productInfo);
    addstock(p);
    res.end("I have received the function name: " + f +"\n name: " + req.query.name + " amount: " + req.query.amount);
});







app.listen(port, function () {
    console.log("Run @ http://localhost:"+port);
})

