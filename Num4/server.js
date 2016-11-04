/**
 * Created by kaya on 11/3/16.
 */
var express = require('express');


var app = express();
var port = 8080;
var products = [{"name" : "ipad", "amount": 6}, {"name" : "xxx", "amount": 1}];
var numOfAmount = 0;
var sales = 0;


function addstock(addedProdct){
    console.log("added: " + JSON.stringify(addedProdct));
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
            console.log("==================there is an identical product==================");
            var additional = parseInt(addedProdct.amount);
            var current = parseInt(products[index].amount);
            var newAmount = 0;
            newAmount = current + additional;
            products[index].amount = newAmount;
            //console.log("total: product = " + products[index].amount);
            showCurrentStocker();
            treated = true;
            //console.log("===========================================================");

        }
        else {
            //console.log("Some thing wrong");
            //can be new product
        }
    }//for
    if(!treated)
    {
        //if addition is already treated
        console.log("==================New product is inserted==================");
        products.push(addedProdct);
        showCurrentStocker();
        //console.log("===========================================================");
    }

}//addstock()
function showCurrentStocker() {
    console.log("============SHOW Current products========");
    console.log(products);
    console.log("=========================================");
}//showCurrentStocker()


function checkstock(req_query){
    console.log("Check stock");

    //console.log(req_query.hasOwnProperty("name"));
    var result = "";
    if(req_query.hasOwnProperty("name"))
    {
        //if user put specific product name in URL
        console.log(req_query.name);
        var p_name = req_query.name;

        var treated = false;
        for(index in products)
        {
            console.log("prodcut: " + products[index].name);
            console.log("p_name" + p_name);
            if(JSON.stringify(products[index].name) === JSON.stringify(p_name))
            {
                result = products[index].name + " : " + products[index].amount;

                console.log(products[index].name + " : " + products[index].amount);
                treated = true;
            }
        }
        if(!treated)
        {
            console.log(p_name + " is not found!");
        }
    }
    else
    {
        console.log("In else");
        //if user do not request specific product
        
        for(index in products)
        {

            result += products[index].name +" : " + products[index].amount + "\n";
        }
        console.log("show result");
        console.log(result);
        return result;
    }
    //if()


}
app.use('/stocker', function (req, res) {
    console.log('in add stock');
    //console.log('in endpoint');
    //var color = req.query.color;
    var f = req.query.function;
    console.log(req.query);

    var productInfo = {"name": req.query.name, "amount": req.query.amount};
    //var p = {"name" : "ipad", "amount":8};
    //addstock(productInfo);
    //addstock(p);
    checkstock(req.query);
    res.end("Current Stock:" + JSON.stringify(products));
});//use







app.listen(port, function () {
    console.log("Run @ http://localhost:"+port);
});//listen

