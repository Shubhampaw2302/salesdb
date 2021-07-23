const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://admin-shubham:Test123@cluster0.0cklb.mongodb.net/saleDB", {useNewUrlParser: true, useUnifiedTopology: true});
// mongodb://localhost:27017/saleDB

const app = express()

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

const salesSchema = {
    id: Number,
    userName: String,
    amount: Number,
    date: Date
  };

const Sale = mongoose.model("Sale", salesSchema)

var sales = []


Sale.find({}, function(err, foundSales) {
    if (foundSales.length > 0) {
      for (let i = 0; i < foundSales.length; i++) {
        sales.push(foundSales[i]);
      }
    }
  });


app.get("/", function(req, res) {

  res.render("body", {
    sales: sales
    });
})

app.get("/adduser", function (req, res) {
    res.render("adduser")
})

app.post("/adduser", function(req, res) {
  const sale = new Sale ({
    id: req.body.id,
    userName: req.body.name,
    amount: req.body.amount,
    date: new Date(req.body.date.slice(6, 10), req.body.date.slice(3, 5)-1, req.body.date.slice(0, 2))
  });

  sales.push(sale);
  sale.save();

  res.redirect("/");


})

app.get("/:when", function (req, res) {
  const requestedStat = _.lowerCase(req.params.when);

  var salesLength = sales.length;
  var totalSum = 0;

  for (var i = 0; i < salesLength; i++) {
    totalSum = totalSum + sales[i].amount
  }

  if (requestedStat == "daily") {
    
    var dailyStats = totalSum/720;

    res.send("Daily stats is: Rs" + dailyStats + " per hour in one month")
  } else if (requestedStat == "weekly") {
    
    var weeklyStats = totalSum/4;

    res.send("Weekly stats is: Rs" + weeklyStats + " per week in one month")

  } else if (requestedStat == "monthly") {

    var monthlyStats = totalSum/30;

    res.send("Monthly stats is: Rs" + monthlyStats + " per day in one month")
  }

})

app.listen(3000, function() {
    console.log("Server has started at port 3000")
});