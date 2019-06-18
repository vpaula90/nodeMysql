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
    inquirer.prompt([
        {
            name: "itemNumber",
            type: "input",
            message: "What is the Id for the product you would like to buy?"
        }, 
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
    
    ]).then(function(answer) {
        console.log(answer);
        connection.query("SELECT * FROM products WHERE products.item_id = ?", [answer.itemNumber], function(err, res) {

            if (res[0].item_id == answer.itemNumber && res[0].stock_quantity >= parseInt(answer.quantity)) {
                console.log("Test");
                var total = res[0].price * parseInt(answer.quantity);
                console.log("Success!");
                console.log("You just spent: $" + total);
              
            var newQuantity = res[0].stock_quantity - parseInt(answer.quantity)
            var newItemId = parseInt(answer.itemNumber);
            console.log(newQuantity);
            console.log(newItemId);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: newItemId
                }], function(err, res) {
                      inquirer.prompt([ 
                        {
                            name: "purchaseMore",
                            type: "confirm",
                            message: "Anything else you would like to purchase?"
                        }])
                      .then(function(answer){
                          if (answer.purchaseMore === true) {
                              showAllProducts();
                          } else {process.exit()}
                          })
                       
                    //    showAllProducts();
                });

            } else if (res[0].item_id == answer.itemNumber && res[0].stock_quantity < parseInt(answer.quantity)) {
                console.log("Sorry! We don't have enough quantity for your order");
                showAllProducts();
            }

        });

    });
};