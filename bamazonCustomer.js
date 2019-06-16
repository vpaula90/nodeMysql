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
  queryAllProducts();
});

function queryAllProducts() {
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
    purchaseItem();
  });
}

function purchaseItem() {
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
        connection.query("SELECT * FROM products WHERE products.item_id = ?", [answer.itemNumber], function(err, res) {

            if (res[0].item_id == answer.itemNumber && res[0].stock_quantity >= parseInt(answer.Quantity)) {
                var TotalPrice = res[0].price * parseInt(answer.Quantity);
                console.log("Success!");
                console.log("You just spent: $" + TotalPrice);
              
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: res[0].stock_quantity - parseInt(answer.Quantity)
                }, {
                    id: res[0].item_id
                }], function(err, res) {
                       console.log("Anything else you would like to add?");
                       queryAllProducts();
                });

            } else if (res[0].item_id == answer.itemNumber && res[0].stock_quantity < parseInt(answer.Quantity)) {
                console.log("Sorry! We don't have enough quantity for your order");
                queryAllProducts();
            }

        });

    });
};