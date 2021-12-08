const express = require("express");
const mysql2 = require("mysql2")
const http = require('http');
const fs=require('fs');
const server = http.createServer();
var nodemailer = require('nodemailer');

require("dotenv").config();

const PORT = process.env.PORT||3000;
const app = express();

const con = mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ics26092021",
    database: "miramaru" 
});

app.use("/css",  express.static(__dirname + '/css'));
app.use("/assets",  express.static(__dirname + '/assets'));
app.use("/script",  express.static(__dirname + '/script'));


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.get('/create',(req,res)=>{
    res.sendFile(__dirname+"/create-account.html");
})

app.get('/login',(req,res)=>{
    res.sendFile(__dirname+"/login.html");
})

app.get('/reset',(req,res)=>{
    res.sendFile(__dirname+"/resetpw.html");
})

app.get('/change-pw',(req,res)=>{
    res.sendFile(__dirname+"/changepw.html");
})


////////

var bodyParser = require('body-parser');
const { response } = require("express");

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.post("/confirm-create",(req,res,next) =>{
    
var newRow=req.body;
var fn=newRow.FirstName;
var ln=newRow.lastName;
var e=newRow.email;
var pw=newRow.password;

console.log(newRow)
let sql = "INSERT INTO `customer` (`customer_fn`, `customer_ln`,`customer_email`,`customer_pw`) VALUES ('"+fn+"','"+ln+"','"+e+"','"+pw+"')";
con.query(sql, (err,result)=>{
    if(!err){
        res.send(result)
    } else{
        res.send(err.message);
    }
})
});

//function fetchData()(res){
//    sql="SELECT * FROM `customer`, function(result) {
//        console.log(result);
//        res.write('<table><tr>');
//        for(var column in result[0]){
//            response.write('<td><label'+column+'</label></td>');
//        }res.write('</tr>')"
//    }
//};

function fetchData(res){
    let sql="SELECT * FROM `customer` WHERE `customer_email` = '"+email+"')";
    con.query(sql, (err, result) => {
        if(Object.values(result[0])==false){
            console.log(result)
            //res.sendFile(__dirname+"/login-invalid.html");
            
          } 
    })
};
    
app.post("/confirm-log",(req,res,next) =>
{
    var email=req.body.em;
    var pass=req.body.pw;
    let sql="SELECT EXISTS(SELECT * FROM `customer` WHERE `customer_email` = '"+email+"' AND `customer_pw` = '"+pass+"')";

    console.log(sql)

    con.query(sql, (err, result) => {
    if(Object.values(result[0])==false){
        console.log(result)
        res.sendFile(__dirname+"/login-invalid.html");
        
      } 
      
      else {

          res.sendFile(__dirname+"/login-success.html");
      }
    
    });
});

app.post("/confirm-reset",(req,res,next) =>
{
    var email=req.body.em;

    console.log(email);

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dice.and.quills@gmail.com',
        pass: 'scramblegamble'
    }
  });
  var mail = {
    from: 'miramaru@noreply <dice.and.quills@gmail.com>',
    to: email,
    subject: 'Request for a new password - Miramaru',
    html:
        '<body>'+
            '<h>Request for password change</h>'+
            '<p>We received your request to change your password.'+ 
            ' Click <span><a href="http://localhost:3000/change-pw">here</a></span> to change password.'+
            '</p>'+
        '</body>'

  };

  let sql="SELECT EXISTS(SELECT 1 FROM `customer` WHERE `customer_email` = '"+email+"')";

    con.query(sql, (err, result) => {
     if(Object.values(result[0])==false){

        res.sendFile(__dirname+"/resetpw-invalid.html");
        
      } 
      
      else {
        transporter.sendMail(mail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          res.sendFile(__dirname+"/resetpw-success.html");
      }
    });
});

app.post("/confirm-change",(req,res,next) =>
{
    var email=req.body.em;
    var pass=req.body.pw;
    let sql="SELECT EXISTS(SELECT * FROM `customer` WHERE `customer_email` = '"+email+"' AND `customer_pw` = '"+pass+"')";

    console.log(sql)

    con.query(sql, (err, result) => {
    if(Object.values(result[0])==false){
        console.log(result)
        res.sendFile(__dirname+"/login-invalid.html");
        
      } 
      
      else {

          res.sendFile(__dirname+"/login-success.html");
      }
    
    });
});
/////

con.connect((err) => {
    if(err){
        console.log(err.message);
    }
    else{
        console.log("connected");
    }
    
});

app.listen(PORT, (err) => {
    if(err){
        console.log(err.message)
    } else{
     console.log("listening to port "+PORT+"...")}
});