var mysql = require("mysql");
var inquirer = require("inquirer");
inquirer.registerPrompt('number', require('inquirer-number-plus'));

// GLOBAL VARIABLES

let products = []; // keep track of products locally
let departments = [];
let departmentChoices = [];

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
  printWithLine(createDisplay("",100));
  printWithLine(createDisplay("MANAGER PORTAL",100));
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
      prompCustomer();
  });

  var departmentQuery = "SELECT * from departments";
  connection.query(departmentQuery, 
    function(err,results) {
        if(err) { 
          console.log('There was an error retrieving the departments');
        }
        departments = results;
        departmentChoices = departments.map(x => x.department_name); 
    });

}

function prompCustomer(currentChoice) {
  
  var choices = [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "exit"
    ];
 
 if(currentChoice){
    choices.splice(choices.indexOf(currentChoice),1);
 }
  inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: choices
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View Products for Sale":
            displayGraph(products);
            prompCustomer("View Products for Sale");
            break;
          case "View Low Inventory":
            displayLowInventory(products);
            prompCustomer("View Low Inventory");
            break;
          case "Add to Inventory":
            displayGraph(products);
            promptAddInventory();
            break;
          case "Add New Product":
            displayGraph(products);
            promptAddProduct();
            break;
          case "exit":
            console.log("Thank you! Come again!");
            connection.end();
            break;
        }
      });
  
}

function promptAddInventory(){
    inquirer
        .prompt({
            name: "item",
            type: "number",
            message: "Enter the ID of the item you want to update inventory:",
            min: 1
        })
        .then(function(answer) {

            var product_id = answer.item;

            let resultArray = products.filter(function(item) {
              return item["item_id"] == product_id;
            });

            if(resultArray.length){
              let item = resultArray[0];
              let id = item.item_id; 
              let product = item.product_name;
              let price = item.price;
              let stock = item.stock_quantity;
    
                printWithLine(createDisplay("",100));
                printWithLine(createDisplay(`${product}  ($${price.toFixed(2)}) [${stock ? stock + ' in stock' : 'Out of Stock'}]`,100));
                
                inquirer
                    .prompt({
                        name: "quantity",
                        type: "number",
                        message: `Enter the inventory amount for '${product}:'`,
                        min: 1
                    }).then(function(result) {
                        var updateQuery = "UPDATE products SET stock_quantity = "+ result.quantity +" WHERE item_id =" + id;
                        connection.query(updateQuery, 
                            function(err,results) {
                                if(err) { 
                                    console.log('There was an error updating the item');
                                }
                                stock = result.quantity;
                                printWithLine(createDisplay("",100));
                                printWithLine(createDisplay(`INVENTORY WAS SUCCESSFULLY UPDATED!`,100));
                                printWithLine(createDisplay(`${product}  ($${price.toFixed(2)}) [${stock ? stock + ' in stock' : 'Out of Stock'}]`,100));
                                start();
                            });

                    });

    
            } else {
                
                printWithLine(createDisplay("",100));
                printWithLine(createDisplay("You entered an invalid item ID - "+product_id,100));
                promptAddInventory();
             
            }

        });
}

function promptAddProduct(){
    inquirer
    .prompt([{
        name: "product_name",
        type: "input",
        message: "Enter the product name:",
        min: 1
    },{
        name: "department_name",
        type: "list",
        message: "Select the department:",
        choices: departmentChoices
    },{
        name: "price",
        type: "input",
        message: "Enter the price:",
        validate: validateDecimal
    },{
        name: "stock_quantity",
        type: "number",
        message: "Enter the current inventory:",
        min: 1
    }])
    .then(function(answer) {
      var price = parseFloat(answer.price).toFixed(2);
      var product_name = answer.product_name.trim();
      var insertQuery = `INSERT INTO products
        (
          product_name, 
          department_name, 
          price, 
          stock_quantity
        ) VALUES (
          "${product_name}",
          "${answer.department_name}",
          "${price}",
          "${answer.stock_quantity}"
        )`;
      connection.query(insertQuery, 
          function(err,results) {
              if(err) { 
                  console.log('There was an error adding the item');
              }
              printWithLine(createDisplay("",100));
              console.log('Product was added successfully.');
              printWithLine(createDisplay("",100));
              start();
          });
        
    });
}

function validateDecimal(number) {
   var reg = /^-{0,1}\d*\.{0,1}\d+$/;
   return reg.test(number) || "Price should be a number!";
}

function displayLowInventory(results) {
  //print header
  var header = "";
  header += "| "+createDisplay("ID",3) + "|";
  header += " "+createDisplay("PRODUCT NAME",65) + "|";
  header += " "+createDisplay("DEPARTMENT",20) + "|";
  header += " "+createDisplay("PRICE",14) + "|";
  header += " "+createDisplay("QUANTITY",10) + "|";
  

  //print each item
  var currentItem = "";
  var counter = 0;
  for( var i = 0 ; i < results.length ; i++ ) {
    if(results[i].stock_quantity < 5){
      counter++;
      if(counter === 1){
        printWithLine(createDisplay(" ",header.length-1));
        printWithLine(header);
      }
      currentItem += "| "+createDisplay(results[i].item_id,3) + "|";
      currentItem += " "+createDisplay(results[i].product_name,65) + "|";
      currentItem += " "+createDisplay(results[i].department_name,20) + "|";
      currentItem += " $"+createDisplay(results[i].price.toFixed(2),13) + "|";
      currentItem += " "+createDisplay(results[i].stock_quantity,10) + "|";
      printWithLine(currentItem);
      currentItem = "";
    }
  }
  if(counter === 0){
    printWithLine(createDisplay("",100));
    printWithLine(createDisplay("There are no items that are low in inventory.",100));
  }
}

function displayGraph(results) {

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
