var mysql = require("mysql");
var inquirer = require("inquirer");
inquirer.registerPrompt('number', require('inquirer-number-plus'));

var department = [];
var departmentChoices = [];

// MYSQL CONNECTION SETTINGS
let connection = mysql.createConnection({
  
  host: "localhost",

  port: 8889, 

  user: "root",

  password: "secret",

  database: "bamazon"

});

// CONNECT TO MYSQL SERVER
connection.connect(function(err) {
  if (err) throw err;
  
  // Run the start function
  printWithLine(createDisplay("",100));
  printWithLine(createDisplay("SUPERVISOR PORTAL",100));
  start();
});

function start() {
    var departmentQuery = "SELECT * from departments";
    connection.query(departmentQuery, 
        function(err,results) {
            if(err) { 
            console.log('There was an error retrieving the departments');
            }
            departments = results;
            departmentChoices = departments.map(x => x.department_name); 
        });
    
    promptSupervisor();
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
            displaySalesByDepartment();
            break;
          case "Create New Department":
            createDepartment();
            break;
          case "exit":
            console.log("Thank you! Come again!");
            connection.end();
            break;
        }
      });
}

function displaySalesByDepartment() {

    var query = "SELECT department_id, b.department_name, over_head_costs, SUM(a.product_sales) as product_sales, SUM(a.product_sales)-over_head_costs as total_profit FROM products a RIGHT JOIN departments b ON a.department_name = b.department_name GROUP BY a.department_name, b.department_name ORDER BY b.department_id";
    connection.query(query, 
    function(err,results) {
        if(err) { 
          console.log('There was an error retrieving the products');
        }
        displayGraph(results);
        promptSupervisor("View Product Sales by Department");
    });
  
}

function createDepartment(){
inquirer
    .prompt([{
        name: "department_name",
        type: "input",
        message: "Enter a new department name:",
        validate: checkCurrentDepartments
    },{
        name: "over_head_costs",
        type: "input",
        message: "What is the over-head costs?",
        validate: validateDecimal
    }])
    .then(function(answer) {
      
        var overHeadCosts = parseFloat(answer.over_head_costs).toFixed(2);
        var departmentName = answer.department_name.trim();
        var insertQuery = `INSERT INTO departments
        (
            department_name, 
            over_head_costs
        ) VALUES (
            "${departmentName}",
            "${overHeadCosts}"
        )`;
        connection.query(insertQuery, function(err,results) {
            if(err) { 
                console.log('There was an error adding the department');
            }
            printWithLine(createDisplay("",100));
            printWithLine(createDisplay(`${departmentName} department was added successfully.`,100));
            start();
        });
    });
   
}

function checkCurrentDepartments(input){
    var department = input.trim();
    if(departmentChoices.indexOf(department) === -1){
        return true;
    } else {
        return "Department already exists";
    }
}

function validateDecimal(number) {
   var reg = /^-{0,1}\d*\.{0,1}\d+$/;
   return reg.test(number) || "Price should be a number!";
}

function displayGraph(results) {

  //print header
  var header = "";
  header += "| "+createDisplay("DEPARTMENT ID",15) + "|";
  header += " "+createDisplay("DEPARTMENT NAME",18) + "|";
  header += " "+createDisplay("OVER-HEAD COSTS",18) + "|";
  header += " "+createDisplay("PRODUCT SALES",18) + "|";
  header += " "+createDisplay("TOTAL PROFIT",18) + "|";
  printWithLine(createDisplay(" ",header.length-1));
  printWithLine(header);
 
  //print each item
  currentItem = "";
  var currentItem = "";
  for( var i = 0 ; i < results.length ; i++ ) {
    var overHeadCosts = "$"+parseInt(results[i].over_head_costs).toFixed(2);
    var productSales = 0;
    if(results[i].product_sales){
        productSales = "$"+parseInt(results[i].product_sales).toFixed(2);
    }
    var totalProfit = 0;
    if(results[i].total_profit){
        totalProfit = parseInt(results[i].total_profit).toFixed(2);
        if(totalProfit < 0){ 
            totalProfit = "-$"+ (-1*totalProfit);
        } else {
            totalProfit = "$"+totalProfit;
        }
    } else {
        totalProfit = 0;
    }
    currentItem += "| "+createDisplay(results[i].department_id,15) + "|";
    currentItem += " "+createDisplay(results[i].department_name,18) + "|";
    currentItem += " "+createDisplay(overHeadCosts,18) + "|";
    currentItem += " "+createDisplay(productSales,18) + "|";
    currentItem += " "+createDisplay(totalProfit,18) + "|";
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
