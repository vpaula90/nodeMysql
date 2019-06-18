var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "MySql!23",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showAllProducts();
});

function showAllProducts() {
    console.log("Welcome to Bamazon!!");
    console.log("--------------------");
  connection.query("SELECT * FROM products", function(err, res) {
      for (var i=0; i< res.length; i++){
    console.log( 
         "Item ID: " +
          res[i].item_id +
          " || Product Name: " +
          res[i].product_name +
          " || Department Name: " +
          res[i].department_name +
          " || Price: " +
          res[i].price +
          " || Stock Quantity: " +
          res[i].stock_quantity
      );
    }
    purchase();
  });
}

function purchase() {
// running the purchase function, first ask the user for which item and then how many
    inquirer.prompt([
        {
            // name = the name that stores the answers in the answers hash
            name: "itemNumber",

            // type = what type of prompt is it?
            type: "input",

            // message = message to print
            message: "What is the Id for the product you would like to buy?"
        }, 
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
    
    ]).then(function(answers) {
    // use the answerss from the questions above to pull from the database 
        // console.log(answers);

    // from the database select all from the products table where item_id = the itemNumber (the id that was prompted for)
        connection.query("SELECT * FROM products WHERE products.item_id = ?", [answers.itemNumber], function(err, res) {

// if the item id in the database matches the number for the itemNumber(the answers to which item ID in the inquirer prompt) and if the quantity is less than the quantity in the answers
            if (res[0].item_id == answers.itemNumber && res[0].stock_quantity >= parseInt(answers.quantity)) {
    // get the price from the item in the database and multiply it by the quantity from the answers
                var total = res[0].price * parseInt(answers.quantity);
                console.log("Success!");
    // show the total cost for what you are purchasing
                console.log("You just spent: $" + total);

    // variable to update the quantity in the database
            var newQuantity = res[0].stock_quantity - parseInt(answers.quantity)
            var newItemId = parseInt(answers.itemNumber);
            // console.log(newQuantity);
            // console.log(newItemId);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: newItemId
                }], function(err, res) {

            // prompt user if they want to purchase something else
                      inquirer.prompt([ 
                        {
                            name: "purchaseMore",
                            type: "confirm",
                            message: "Anything else you would like to purchase?"
                        }])
                
                        // if yes run all products function wich includes purchase function in the end of it so it will relaunch the purchase inruier prompts etc. 
                      .then(function(answers){
                          if (answers.purchaseMore === true) {
                              showAllProducts();
                        
                            //   if no then exit and stop the server
                          } else {process.exit()}
                          })
                       
                });
// if asking for more than what is in stock let the user no there is not enogh for their order
            } else if (res[0].item_id == answers.itemNumber && res[0].stock_quantity < parseInt(answers.quantity)) {
                console.log("Sorry! We don't have enough quantity for your order");
                showAllProducts();
            }

        });

    });
};