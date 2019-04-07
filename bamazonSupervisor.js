var mysql = require("mysql");
var inquirer = require("inquirer");
inquirer.registerPrompt('number', require('inquirer-number-plus'));

// GLOBAL VARIABLES

let products = []; // keep track of products locally
let departments = []; 

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
  printWithLine(createDisplay("SUPERVISOR PORTAL",100));
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
  });

  var supervisorQuery = "SELECT * from departments";
  connection.query(supervisorQuery, 
  function(err,results) {
      if(err) { 
        console.log('There was an error retrieving departments data');
      }
      departments = results;
      promptSupervisor();
  });
}

function promptSupervisor(currentChoice) {
  
  var choices = [
        "View Product Sales by Department",
        "Create New Department",
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
          case "View Product Sales by Department":
           
            break;
          case "Create New Department":
           
            break;
          case "exit":
            console.log("Thank you! Come again!");
            connection.end();
            break;
        }
      });
  
}

function validateDecimal(number) {
   var reg = /^-{0,1}\d*\.{0,1}\d+$/;
   return reg.test(number) || "Price should be a number!";
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
