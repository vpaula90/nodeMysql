DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45),
  price DECIMAL(10,2),
  stock_quantity INTEGER,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Babe Lash", "Beauty", "45.10", "1000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kitty Litter", "Pet", "21", "5000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tooth Brush Head", "Toiletries", "15", "10000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone Case", "technology", "12.50", "100000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Water Bottle", "Fitness", "25", "100");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cat toy", "Pet", "10", "200");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Picture Frame", "Home", "20.75", "20");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Batteries", "technology", "5", "9000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad case", "technology", "15.20", "50");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dvd", "Entertainment", "20", "80");

