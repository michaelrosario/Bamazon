var mysql = require("mysql");
var inquirer = require("inquirer");

// GLOBAL VARIABLES

let products = []; // keep track of products locally

let connection = mysql.createConnection({
  
  host: "localhost",

  port: 8889, 

  user: "root",

  password: "secret",

  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  var query = "SELECT * from products";
  connection.query(query, 
  function(err,results) {
      if(err) { 
        console.log('There was an error retrieving the products');
      }
      products = results;
      displayGraph(results);
      prompCustomer();
  });
}

function prompCustomer() {
  inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Purchase an item",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "Purchase an item":
            startOrder();
            break;
          case "exit":
            console.log("Thank you! Come again!");
            connection.end();
            break;
        }
      });
  
}
function startOrder(){
  inquirer
      .prompt({
        name: "item",
        type: "input",
        message: "Enter the ID of the item you want to purchase:"
      })
      .then(function(answer) {

        var product_id = answer.item;

        let resultArray = products.filter(function(item) {
          return item["item_id"] == product_id;
        });
        if(resultArray.length){

          if(resultArray[0].stock_quantity <= 0){
            
            console.log("Item is out of stock!");
            startOrder();

          } else {

            console.log("Processing order: `"+resultArray[0].product_name+"`");
            processOrder(product_id);

          }

        } else {
          console.log("You entered an invalid item ID - `"+product_id+"`");
          startOrder();
        }
  });
}

function processOrder(id){
  // check quantity
  var query = "SELECT stock_quantity from products WHERE item_id =" + id;
  connection.query(query, 
  function(err,results) {
      if(err) { 
        console.log('There was an error processing your order');
      }
      var quantity = parseInt(stock_quantity);
      if(quantity <= 0){
        
        console.log("This item is out of stock, choose a different product.");
        start();

      } else {

        // Update product

      }
  });

}

function displayGraph(results){

  //print header
  var header = "";
  header += "| "+createDisplay("ID",3) + "|";
  header += " "+createDisplay("PRODUCT NAME",65) + "|";
  header += " "+createDisplay("PRICE",14) + "|";
  header += " "+createDisplay("QUANTITY",10) + "|";
  printWithLine(createDisplay(" ",header.length-1));
  printWithLine(header);
 
  //print each item
  currentItem = "";
  var currentItem = "";
  for( var i = 0 ; i < results.length ; i++ ) {
    currentItem += "| "+createDisplay(results[i].item_id,3) + "|";
    currentItem += " "+createDisplay(results[i].product_name,65) + "|";
    currentItem += " $"+createDisplay(results[i].price.toFixed(2),13) + "|";
    currentItem += " "+createDisplay(results[i].stock_quantity,10) + "|";
    printWithLine(currentItem);
    currentItem = "";
  }
}

// format columns to be the same length
function createDisplay(input,limit){
  var limit = parseInt(limit);
  if(input != ""){
    var inputStr = input.toString();
    var strLength = inputStr.trim().length;
    if(input.length > limit){
      input = input.slice(0,limit-4);
      input += "...";
      strLength = input.length;
    }
    var arrayLength = limit - strLength;
    for(var i = 0; i < arrayLength; i++){
      input += " ";
    }
  }
  return input;
}

function printWithLine(text){

  var textLength = text.length;
  console.log(text);
  var line = "";
  for(var i = 0; i < textLength; i++){
    line += "-";
  }
  console.log(line);

}
