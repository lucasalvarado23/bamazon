var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // your username 
    user: "root",

    //your password
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // create();
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        askCustomer();
        //  connection.end();
    });
}

function askCustomer() {
    var product;
    inquirer.prompt([{
        name: "action",
        type: "input",
        message: "What is the products ID number?"
    }]).then(function(answers) {
        product = answers.action
        console.log(answers.action)
        inquirer.prompt([{
            name: "quantity",
            type: "input",
            message: "How many would you like?"
        }]).then(function(answers2) {
            console.log(answers2);
            console.log(answers2.quantity);
            var customerQuantity = answers2.quantity
            connection.query("SELECT stock_quantity FROM products WHERE items_id =? ", product,
                function(err, res) {
                    if (err) throw err;
                    console.log(res);
                    //console.log(res.RowDataPacket.stock_quantity);
                    //console.log(res.stock_quantity);
                    console.log("here "+ customerQuantity);
                    var inventory = res[0].stock_quantity;

                    if (inventory < customerQuantity) {
                        console.log('sorry we dont have enough')
                    } else {
                        console.log("answer2: "+answers2, " product:"+product)
                        connection.query("UPDATE products SET stock_quantity = stock_quantity - ?  where items_id = ?; ", [customerQuantity, product],
                            function(err, res) {
                                if (err) throw err;
                                console.log(res);
                                //console.log(res.RowDataPacket.stock_quantity);
                                //console.log(res.stock_quantity);
                                console.log('Thank you for your order');

                            })
                    }
                })


        })


    });
}

//update table name - equal to quantity where id number = answers.action