/**
 * Created by kaya on 11/3/16.
 */
var express = require('express');
//var mongo = require('mongo');
//mongodb client side
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
//Connection URL
var url = 'mongodb://localhost:27017/mongodb';
var app = express();
var port = 8088;
var products = [];//store products
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
    var error = "";
    if(req_query.hasOwnProperty("amount"))
    {
        
        
        var additional = parseInt(req_query.amount);//treat double as int
        //console.log(req_query.amount);
        //var givenAmount = parseInt(JSON.stringify(req_query.amount));
        //console.log(Number.isInteger(additional));
        if(! Number.isInteger(additional))
        {
            error = "ERROR @ isInt";
        }
        else
        {
            if(products.length == 0)
            {//if products is empty array
                newProduct = {"name": req_query.name, "amount": req_query.amount};
                insertedData = {"name": req_query.name, "amount": req_query.amount};

                products.push(newProduct);
                //add to mognodb
                MongoClient.connect(url, function(err, db){
                    assert.equal(null, err);
                    console.log("Connected successfully to server");

                    //call insert document function:
                    insertDocuments(db, function (){
                        db.close();
                    });//end of insertDucments function
                });//end of connect fun

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
                    //new product will be inserted
                    newProduct = {"name": req_query.name, "amount": req_query.amount};
                    insertedData = {"name": req_query.name, "amount": req_query.amount};
                    products.push(newProduct);
                    MongoClient.connect(url, function(err, db){
                        assert.equal(null, err);
                        console.log("Connected successfully to server");

                        //call insert document function:
                        insertDocuments(db, function (){
                            db.close();
                        });//end of insertDucments function
                    });//end of connect fun

                }
                if(treated)
                {
                    //Insert to DB the case where there is the product already
                    //query database by name
                    MongoClient.connect(url, function(err, db) {
                        assert.equal(null, err);
                            updateProductAmount(db, function() {
                                db.close();
                            }, req_query, newAmount);
                        });



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
            insertedData =  {"name": req_query.name, "amount": 1};
            products.push(newProduct);
            MongoClient.connect(url, function(err, db){
                assert.equal(null, err);
                console.log("Connected successfully to server");

                //call insert document function:
                insertDocuments(db, function (){
                    db.close();
                });//end of insertDucments function
            });//end of connect fun
        }
        else
        {
            //treatment for array of json
            for(index in products)
            {
                //check if the product is in
                //
                // products already?
                if (JSON.stringify(products[index].name) === JSON.stringify(req_query.name)) {
                    //yes, there is an identical product
                    var current = parseInt(products[index].amount);
                    newAmount = current + 1;//1 is default value
                    //update amount
                    products[index].amount = newAmount;
                    treated = true;
                }

            }//for

            if(!treated)
            {
                //new Product without amount
                newProduct = {"name": req_query.name, "amount": 1};
                insertedData = {"name": req_query.name, "amount": 1};
                products.push(newProduct);
                MongoClient.connect(url, function(err, db){
                    assert.equal(null, err);
                    console.log("Connected successfully to server");

                    //call insert document function:
                    insertDocuments(db, function (){
                        db.close();
                    });//end of insertDucments function
                });//end of connect fun

            }//if(!treated)
            if(treated)
            {
                //query database by name
                MongoClient.connect(url, function(err, db) {
                    assert.equal(null, err);
                    updateProductAmount(db, function() {
                        db.close();
                    }, req_query, newAmount);
                });



            }
        }

    }
    //showCurrentStocker();

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
                result = products[index].name + " : " + products[index].amount;

                //console.log(products[index].name + " : " + products[index].amount);
                treated = true;
            }
        }
        if(!treated)
        {
            result = p_name + " is not found in stock!";
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
    //console.log(result);
    return result;
    //if()



}//checkstock
function sell(req_query) {
    //console.log("in sell");
    var index = 0;
    var newSalse = 0;
    var currentAmount = 0;
    var currentSalse = 0;
    var error = "";
    console.log();
    //find index of products
    if(req_query.hasOwnProperty("name")) {
        if(products.length == 0)
        {
            //products is now empty
            return error = "Error: empty stock";
            
        }
        for (; (index <= products.length) && !(JSON.stringify(products[index].name) === JSON.stringify(req_query.name)); index++);


        //console.log("products[index] =  " + products[index].name);
        if (index == products.length) {
             return error = "ERROR: no such product in stock";
        }
        else {

            if (req_query.hasOwnProperty("amount")) 
            {
                //console.log("amount is in input");
                if (req_query.hasOwnProperty("price")) {
                    newSalse = req_query.amount * req_query.price;
                    //console.log("newSalse: " + newSalse);
                    //add newSalse property
                    if(!products[index].hasOwnProperty("salse"))
                    {
                        products[index].salse = newSalse;
                    }
                    else
                    {
                        currentSalse = parseFloat(products[index].salse);
                        currentSalse = currentSalse + newSalse;
                        products[index].salse = currentSalse;

                    }
                    //currentSalse = parseInt(products[index].salse);
                    //products[index].salse = currentSalse + newSalse;
                    //console.log("newSalse: " + products[index].salse);
                    
                    //parse current amount
                    currentAmount = parseInt(products[index].amount);
                    //console.log("Current Amount : " + currentAmount);
                    //console.log("req_query.amout" + req_query.amount);
                    currentAmount = currentAmount - parseInt(req_query.amount);
                    //update  product amount
                    if (currentAmount < 0) {
                        error = "Error: Not enough stock!";
                        products[index].amount = 0;

                    }
                    else {

                        products[index].amount = currentAmount;
                    }
                    //console.log("Current Amount : " + currentAmount);
                    //console.log("products[index].amount : " + products[index].amount);
                }
                else {
                    //No price input in URL
                    currentAmount = parseInt(products[index].amount);
                    currentAmount = currentAmount - parseInt(req_query.amount);
                    //Update product amount
                    if (currentAmount < 0) {
                        error = "ERROR: Not enough stock!";
                        products[index].amount = 0;
                    }
                    else {
                        products[index].amount = currentAmount;
                    }

                    //console.log("Current Amount : " + currentAmount);
                    //console.log("products[index].amount : " + products[index].amount);

                }//price check
            }
            else {
                //No amount input in URL
                //default value for amount is 1
                //var soldAmount = 1;

                currentAmount = parseInt(products[index].amount);
                if (req_query.hasOwnProperty("price")) {
                    //amount is 1 and price is given price
                    newSalse = parseFloat(req_query.price) * 1.0;
                    //calc amount
                    currentAmount = currentAmount - 1;
                    products[index].amount = currentAmount;
                    //currentSalse = parseFloat(products[index].salse);
                    //products[index].salse = currentSalse + newSalse;

                    if(!products[index].hasOwnProperty("salse"))
                    {
                        //first time to store salse attibute
                        products[index].salse = newSalse;
                    }
                    else
                    {
                        currentSalse = parseFloat(products[index].salse);
                        currentSalse = currentSalse + newSalse;
                        products[index].salse = currentSalse;

                    }
                }
                else {
                    //substract one from amount and no prive in URL
                    currentAmount = currentAmount - 1;
                    products[index].amount = currentAmount;
                    //
                }


            }//check amount property

        }//index check
    }//name requirement check
    else
    {
        error = "ERROR: missing requirement";
    }
    return error;
    //console.log("in sell aft for");
};//sell

function checksales(req_query){
    var index = 0;
    var result = "";
    var temp_salse = 0.0;
    var fixed_salse = 0.0;
    if(req_query.hasOwnProperty("name"))
    {
        for (; (index <= products.length) && !(JSON.stringify(products[index].name) === JSON.stringify(req_query.name)); index++);
        if (index == products.length) {
            result = "Error: no such product in stock";
        }
        else
        {
            if(products[index].hasOwnProperty("salse"))
            {
                temp_salse = parseFloat(products[index].salse);
                fixed_salse = temp_salse.toFixed(2);          
        
                result = products[index].name + " : "+ fixed_salse ;
            }
            else
            {
                result = "Error: Salse info is not available";
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
                temp_salse = parseFloat(products[index].salse);
                fixed_salse = temp_salse.toFixed(2);
                result = products[index].name + " : "+ fixed_salse;
            }
        }//for
        
    }
    return result;
    
}//checkSalse

app.use('/stocker', function (req, res) {
    //console.log('in add stock');
    //console.log('in endpoint');
    //var color = req.query.color;
    //console.log("type of");
    //console.log(typeof req.query.amount);
    console.log(req.query);
    //console.log(req.body);
    var result = "";
    if(req.query.hasOwnProperty("amount")&& req.query.amount.includes("."))
    {
      result = "ERROR: amount is decimal";
    }
    else
    {
        var f = req.query.function;
        if(f === "addstock")
        {
            //var productInfo = {"name": req.query.name, "amount": req.query.amount};
            result = addstock(req.query);
        }
        else if(f === "checkstock")
        {
            result = checkstock(req.query);
        }
        else if (f === "sell")
        {
            result = sell(req.query);
        }
        else if (f=== 'checksales')
        {
            result = checksales(req.query);
        }
        else if(f === 'deleteall')
        {
            products = [];
            //delete all data in mognoDB
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);

                removeAllProduct(db, function() {
                    db.close();
                });
            });
        }
        else
        {
            reuslt = "Error: No such function";
        }

    }


    //console.log("function : " + req.query.function);

    //if(f === )

   
    //var p = {"name" : "ipad", "amount":8};
    //addstock(productInfo);
    //addstock(p);
    //checkstock(req.query);
    //sell(req.query);
    if(result === undefined)
    {
        //request was no error and the function has  no output msg
        res.end();
    }
    else
    {
        //there is output msg xor error msg
        res.end(result + "\n");
    }
    //res.end("Current Stock:" + JSON.stringify(products) +"\n" + result +"\n");
});//use
//functions for mongoDB
var insertDocuments = function (db, callback) {
    //console.log("print DB");
    //console.log(db);
    //Get the documents collection
    var collection = db.collection('products');
    console.log("Collection:")
    console.log(collection);

    //Insert some documents
    collection.insertOne(insertedData, function (err, result) {
            if(err)
            {
                console.log("ERROR : "+err);
            }
            else
            {
                console.log("Inserted %d documents into the collection\n console output(result)", result.insertedCount);
            }
            //assert.equal(null, err);
            ///assert.equal(3, result.result.n);
            //assert.equal(3, result.ops.length);

            /* console.log(result);
             console.log("show result.result");
             console.log(result.result);
             console.log("show result.result.ok");
             console.log(result.result.ok);

             console.log("result.ops");
             console.log(result.ops);

             console.log("inserted IDs");
             console.log(result.insertedIds);
             */
            //console.log("result.ops.a");
            //console.log(result.ops.a);//==> undefined
            //console.log("result.ops._id");
            //console.log(result.ops._id); //==> undefined

            callback(result);
        } //function(err, reuslt)
    );//insert many

}//inset Documents
var removeAllProduct = function(db, callback) {
    db.collection('products').deleteMany( {}, function(err, results) {
        console.log(results);
        callback();
    });
};

var updateProductAmount = function(db, callback, req_query, newAmount) {
    console.log("====req_query====\n\n");
    console.log(req_query+"\n\n");
    db.collection('products').updateOne(
        { "name" : req_query.name },
        {
            $set: { "amount": newAmount },
            $currentDate: { "lastModified": true }
        }, function(err, results) {
            console.log(results);
            callback();
        });
};//updateProductAmount
var updateProductSales = function(db, callback, req_query, newSalse) {
    db.collection('products').updateOne(
        { "name" : req_query.name },
        {
            $set: { "salse": newSalse },
            $currentDate: { "lastModified": true }
        }, function(err, results) {
            console.log(results);
            callback();
        });
};//updateProductSales





app.listen(port, function () {
    console.log("Run @ http://localhost:"+port);
});//listen



