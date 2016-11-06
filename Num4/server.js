/**
 * Created by kaya on 11/3/16.
 */
var express = require('express');


var app = express();
var port = 8080;
var products = [];//store prodcuts
var numOfAmount = 0;
var sales = 0;

function sortBy(propaty){
    return function(a,b){
        if( a[propaty] > b[propaty]){
            return 1;
        }else if( a[propaty] < b[propaty] ){
            return -1;
        }
        return 0;
    }
}//sortBy


function addstock(req_query){

    var newAmount = 0;//init newAmount
    var treated = false;//check if given product is treated
    var newProduct = {};
    if(req_query.hasOwnProperty("amount"))
    {
        var additional = parseInt(req_query.amount);//treat double as int
        console.log(req_query.amount);
        //var givenAmount = parseInt(JSON.stringify(req_query.amount));
        console.log(Number.isInteger(additional));
        if(! Number.isInteger(additional) )
        {

            console.log("ERROR @ isInt");
        }
        else
        {
            if(products.length == 0)
            {//if products is empty array
                newProduct = {"name": req_query.name, "amount": req_query.amount};
                products.push(newProduct);
            }
            else
            {
                for(index in products)
                {
                    //check if the product is in products already?
                    if (JSON.stringify(products[index].name) === JSON.stringify(req_query.name)) {
                        //yes these is an identical product

                        //make data of amount to be numerical

                        var current = parseInt(products[index].amount);
                        if(Number.isNaN(current))
                        {
                            //add new amount property
                            products[index].amount = additional;
                            treated = true;

                        }
                        else
                        {
                            //calculate new amount
                            newAmount = current + additional;
                            //update amount
                            products[index].amount = newAmount;
                            treated = true;//add process is done
                        }


                    }//if
                }//for
                if(!treated)
                {
                    //new product will inserted
                    newProduct = {"name": req_query.name, "amount": req_query.amount};
                    products.push(newProduct);
                }
                
            }
            
            
        }//integercheck

    }
    else //when amount is not given in URL
    {
        if(products.length == 0)
        {
            //new Product without amount
            newProduct = {"name": req_query.name, "amount": 1};
            products.push(newProduct);
        }
        else
        {
            for(index in products)
            {
                //check if the product is in products already?
                if (JSON.stringify(products[index].name) === JSON.stringify(req_query.name)) {
                    //yes, there is an identical product
                    var current = parseInt(products[index].amount);
                    newAmount = current + 1;//1 is default value
                    //update amount
                    products[index].amount = newAmount;
                    treated = true;
                }
            }
            if(!treated)
            {
                //new Product without amount
                newProduct = {"name": req_query.name, "amount": 1};
                products.push(newProduct);

            }
        }

    }
    showCurrentStocker();

}//addstock()
function showCurrentStocker() {
    console.log("============SHOW Current products========");
    console.log(products);
    console.log("=========================================");
}//showCurrentStocker()


function checkstock(req_query){
    //console.log("Check stock");

    //console.log(req_query.hasOwnProperty("name"));
    var result = "";
    if(req_query.hasOwnProperty("name"))
    {
        //if user put specific product name in URL
        //console.log(req_query.name);
        var p_name = req_query.name;

        var treated = false;
        for(index in products)
        {
            //console.log("prodcut: " + products[index].name);
            //console.log("p_name" + p_name);
            if(JSON.stringify(products[index].name) === JSON.stringify(p_name))
            {
                result = [index].name + " : " + products[index].amount;

                //console.log(products[index].name + " : " + products[index].amount);
                treated = true;
            }
        }
        if(!treated)
        {
            console.log(p_name + " is not found!");
        }
        /*else
        {
            console.log("show result");
            console.log(result);
        }*/
    }
    else
    {
        //console.log("In else");
        //if user do not request specific product
        //console.log("sorting");
        products.sort( sortBy("name") );
        //console.log("show result");
        //console.log(products);
        
        for(index in products)
        {
            result += products[index].name +" : " + products[index].amount + "\n";
        }

    }//else
   
    
    //console.log("show result of string");
    console.log(result);
    //return result;
    //if()



}//checkstock
function sell(req_query) {
    console.log("in sell");
    var index = 0;
    var newSalse = 0;
    var currentAmount = 0;
    console.log();
    //find index of products
    if(req_query.hasOwnProperty("name")) {
        for (; (index <= products.length) && !(JSON.stringify(products[index].name) === JSON.stringify(req_query.name)); index++);


        console.log("products[index] =  " + products[index].name);
        if (index == products.length) {
            console.log("Sold Out: no such product in stock");
        }
        else {

            if (req_query.hasOwnProperty("amount")) 
            {
                //console.log("amount is in input");
                if (req_query.hasOwnProperty("price")) {
                    newSalse = req_query.amount * req_query.price;
                    //console.log("newSalse: " + newSalse);
                    //add newSalse property
                    products[index].salse = newSalse;
                    console.log("newSalse: " + products[index].salse);
                    currentAmount = parseInt(products[index].amount);
                    console.log("Current Amount : " + currentAmount);
                    console.log("req_query.amout" + req_query.amount);
                    currentAmount = currentAmount - parseInt(req_query.amount);
                    //update  product amount
                    if (currentAmount < 0) {
                        console.log("Not enough stock!");
                        products[index].amount = 0;

                    }
                    else {

                        products[index].amount = currentAmount;
                    }
                    console.log("Current Amount : " + currentAmount);
                    console.log("products[index].amount : " + products[index].amount);
                }
                else {
                    //No price input in URL
                    currentAmount = parseInt(products[index].amount);
                    currentAmount = currentAmount - parseInt(req_query.amount);
                    //Update product amount
                    if (currentAmount < 0) {
                        console.log("ERROR");
                        products[index].amount = 0;
                    }
                    else {
                        products[index].amount = currentAmount;
                    }

                    console.log("Current Amount : " + currentAmount);
                    console.log("products[index].amount : " + products[index].amount);

                }//price check
            }
            else {
                //No amount input in URL
                //default value for amount is 1
                //var soldAmount = 1;

                currentAmount = parseInt(products[index].amount);
                if (req_query.hasOwnProperty("price")) {
                    //amount is 1 and price is given price
                    newSalse = req_query.price * 1;
                    currentAmount = currentAmount - 1;
                    products[index].amount = currentAmount;
                    products[index].salse = newSalse;
                }
                else {
                    //substract one from amount
                    currentAmount = currentAmount - 1;
                    products[index].amount = currentAmount;
                    //
                }


            }//check amount property

        }//index check
    }//name requirement check
    else
    {
        console.log("ERROR missing requirement");
    }
    //console.log("in sell aft for");
};

function checksales(req_query){
    var index = 0;
    if(req_query.hasOwnProperty("name"))
    {
        for (; (index <= products.length) && !(JSON.stringify(products[index].name) === JSON.stringify(req_query.name)); index++);
        if (index == products.length) {
            console.log("Sold Out: no such product in stock");
        }
        else
        {
            if(products[index].hasOwnProperty("salse"))
            {
                console.log( products[index].name + " : "+ products[index].salse);
            }
            else
            {
                console.log("Salse info is not available");
            }
            
        }
        /*for(index in products)
        {
            if(JSON.stringify(products[index].name) === JSON.stringify(req_query.name))
            {
                
            }
            if(products[index].hasOwnProperty("salse"))
            {
                console.log( products[index].name + " : "+ products[index].salse);
            }
        }*/
    }
    else
    {
        //No specific name is given
        for(index in products)
        {
            if(products[index].hasOwnProperty("salse"))
            {
                console.log( products[index].name + " : "+ products[index].salse);
            }
        }//for
        
    }
    
}//checkSalse

app.use('/stocker', function (req, res) {
    //console.log('in add stock');
    //console.log('in endpoint');
    //var color = req.query.color;
    var f = req.query.function;
    if(f === "addstock")
    {
        //var productInfo = {"name": req.query.name, "amount": req.query.amount};
        addstock(req.query);
    }
    else if(f === "checkstock")
    {
        checkstock(req.query);
    }
    else if (f === "sell")
    {
        sell(req.query);
    }
    else if (f=== 'checksales')  
    {
        checksales(req.query);
    }
    else if(f === 'deleteall')
    {
        products = [];
    }
    else
    {
        console.log("No such function");
    }
    //console.log("function : " + req.query.function);

    //if(f === )

   
    //var p = {"name" : "ipad", "amount":8};
    //addstock(productInfo);
    //addstock(p);
    //checkstock(req.query);
    //sell(req.query);
    res.end("Current Stock:" + JSON.stringify(products));
});//use







app.listen(port, function () {
    console.log("Run @ http://localhost:"+port);
});//listen

