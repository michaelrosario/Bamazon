var mysql = require("mysql");
var inquirer = require("inquirer");
inquirer.registerPrompt('number', require('inquirer-number-plus'));

// GLOBAL VARIABLES
let products = []; // keep track of products locally

// CONNECTION SETTINGS
let connection = mysql.createConnection({
  
  host: "localhost",
  port: 8889, 
  user: "root",
  password: "secret",
  database: "bamazon"

});

// CONNECT TO MYSQL DATABASE
connection.connect(function(err) {
  if (err) throw err;
  
  // start functions
  printWithLine(createDisplay("",100));
  printWithLine(createDisplay("CUSTOMER PORTAL",100));
  start();
});

function start() {
  var query = "SELECT * from products";
  connection.query(query, 
  function(err,results) {
      if(err) { 
        console.log('There was an error retrieving the products');
      }
      products = results; // store to local copy of DB
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
            displayGraph(products);
            startOrder();
            break;
          case "exit":
            console.log("Thank you! Come again!");
            connection.end();
            break;
        }
      });
}

// Ask user for the ID for purchase
function startOrder(){
  inquirer
      .prompt({
        name: "item",
        type: "number",
        message: "Enter the ID of the item you want to purchase:",
        min: 1
      })
      .then(function(answer) {

        var product_id = answer.item;

        // Check if ID exists in the local copy of DB
        let resultArray = products.filter(function(item) {
          return item["item_id"] == product_id;
        });

        if(resultArray.length){
          let item = resultArray[0];
          let id = item.item_id; 
          let product = item.product_name;
          let price = item.price;
          let stock = item.stock_quantity;

          // Out of Stock - Start again
          if(resultArray[0].stock_quantity <= 0){
            printWithLine(createDisplay("",100));
            printWithLine(createDisplay(`${product}  ($${price.toFixed(2)}) [${stock ? stock + ' in stock' : 'Out of Stock'}]`,100));
            printWithLine(createDisplay('Please enter a different product ID',100));
            startOrder();

          } else {

            // In stock, run function to ask for quantity
            printWithLine(createDisplay("",100));
            printWithLine(createDisplay(`${product}  ($${price.toFixed(2)}) [${stock ? stock + ' in stock' : 'Out of Stock'}]`,100));
            promptForQuantity(resultArray[0],product_id);
            
          }

        } else {

          // Invalid Item ID
          printWithLine(createDisplay("",100));
          printWithLine(createDisplay("You entered an invalid item ID - "+product_id,100));
          startOrder();

        }
  });
}

// Ask for how many items to buy, we limit the user to select 1 to actual inventory amount
function promptForQuantity(product,id) {
  var query = "SELECT stock_quantity,price from products WHERE ?";
  connection.query(query,{
      item_id: id
    },
    function(err,results) {
      if(err) { 
        console.log('There was an error loading the item.');
      }
      var quantity = parseInt(product.stock_quantity);
      var price = parseInt(product.price);
      
      if(quantity <= 0){
        
        console.error("This item is out of stock, choose a different product.");
        start();

      } else if(quantity > 0){

        inquirer
          .prompt({
            name: "quantity",
            type: "number",
            message: `How many do you want to buy? (1-${quantity})`,
            min: 1,
            max: quantity
          })
          .then(function(answer) {
            if(answer.quantity > 0) {
              printWithLine(createDisplay("",100));
              printWithLine(createDisplay("Processing order: `"+product.product_name+"`",100));
              var requestedQuantity = parseInt(answer.quantity);
              var newQuantity = parseInt(quantity) - requestedQuantity;
              var totalCost = price*requestedQuantity;
              purchaseItem(id,newQuantity,totalCost);
            }  else {
              console.log("Invalid quantity.");
              promptForQuantity(product,id)
            }
          });
        }
    });
}

function purchaseItem(id,qty,total){
  var updateQuery = "UPDATE products SET stock_quantity = "+ qty +", product_sales = product_sales + " + total + " WHERE item_id =" + id;
  connection.query(updateQuery, 
    function(err,results) {
        if(err) { 
          console.log('There was an error processing your order');
        }
        printWithLine(createDisplay(`ORDER WAS SUCCESSFULLY PROCESSED! TOTAL $${total.toFixed(2)}`,100));
        start();
    });

}


function displayGraph(results){

  //print header
  var header = "";
  header += "| "+createDisplay("ID",3) + "|";
  header += " "+createDisplay("PRODUCT NAME",65) + "|";
  header += " "+createDisplay("DEPARTMENT",20) + "|";
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
    currentItem += " "+createDisplay(results[i].department_name,20) + "|";
    currentItem += " $"+createDisplay(results[i].price.toFixed(2),13) + "|";
    currentItem += " "+createDisplay(results[i].stock_quantity,10) + "|";
    printWithLine(currentItem);
    currentItem = "";
  }
}

// format columns to be the same length
function createDisplay(input,limit){
  var limit = parseInt(limit);
  if(input != "" || input == 0){
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
