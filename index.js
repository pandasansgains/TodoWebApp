
const express = require('express');
const mysql = require('mysql'); // mysql library
const path = require('path')
const config = require('config');// reference to config file
const http = require('http');
const bodyParser = require('body-parser'); // so we can read encoded forms ( necessary for form)
const session = require('express-session');// so we can have session cookies for auth
const { response } = require('express');



const app = express();
const PORT = 8080;

const JsonParser = bodyParser.json();

const urlEncodedParser = bodyParser.urlencoded({extended : false});// setting it to true will extend to all our REST methods


const connection = mysql.createConnection({ // create connection

    host:  `${config.HOST}`,
    user: `${config.USER}`,
    password: `${config.PASSWORD}`,
    multipleStatements : true

})


app.use(express.static('src'));// reference all static files

app.use(express.json());

app.set("views" , path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

// TODO add password to config for now leave it as secret for test
app.use(session({
	secret:  `${config.SESSIONPASSWORD}`,
	resave: true,
	saveUninitialized: true
}));

app.listen(

    PORT,
    () => console.log(`it's alive on  http://localhost:${PORT}`)

)

//base url
app.get('/',function(req,res) { // to open the main file 

    if(req.session.loggedin){
        res.render('main',{status : "logged in as :" + req.session.username});
    }
    else{
        res.render('main', {status : ''});
    }
    
});

// login page called when clicked . how to call it from html ? should i make a request or 
// can i leave it as href
app.get('/auth',function(req,res) { // to open the main file 
    res.render("login", {connectionStatus: ''});
});

//TODO separate
app.post('/auth', urlEncodedParser , (req,res) =>{

    var username = req.body.username;
    var password = req.body.password;

    if(username && password){ // checking for empty fields
        connection.query("SELECT * from todoapp.credentials p WHERE p.Username ="+ connection.escape(username) +"AND p.Password=" + connection.escape(password) , function(err,sqlResponse){// response from DB
    
            if(err) throw err;

            if(sqlResponse.length > 0){ // at leats one matching password

                req.session.loggedin = true;
				req.session.username = username;

                res.redirect('/');
                
            }
            else{// no account matching 
                res.render('login', {connectionStatus: "Password or Login incorrect. Please enter Username and Password"});
            }
            res.end();
        })
    } 
    else{// TODO if wrong we need to display the thing

        res.render('login', {connectionStatus: "Please enter Username and Password"});
        res.end;
    }
})

app.post('/logout',function(req,res){

    console.log("reached");

    if(req.session.loggedin){

        console.log("true");

        req.session.loggedin = false;
        req.session.username = null;
        //TODO make logout work
        res.render('main', {status : ""});
        res.end;

    }

})


app.get('/plannings', (req,res)=>{

    // provides all the dates of saved dashboards

    const  username  = session.username;

    if(req.session.loggedin ){// logged in and username is valid

        //TODO redact query 
        connection.query("REDACT query here", function(err, sqlResponse){

        })
    }
    // check 
})


//TODO make a dashboard object in the database
app.post('/planning', (req, res) => {

    const jsonObj = req.body;

    let username = req.session.username;
    let date = jsonObj.date;
    let categories = jsonObj.categories; // each category has a list of tasks
 
    if(req.session.loggedin){ // session is active

        handleDashBoard(username,date,categories);// saves to the DB sequentially
        res.send("saved to backend");

    }
    else{
        res.send("Not logged in, we cannot save.");
    }
})



function insertDashboard(user,date){

    return new Promise(( resolve,reject) =>{ connection.query("INSERT INTO todoapp.dashboard (user,date) VALUES (?,?); SELECT LAST_INSERT_ID()",[user,date], function(err,sqlResponse){// response from DB

            if (err) {
                reject(err);
            }
            resolve(sqlResponse);// here the value is undefined
            // if no error successfully inserted
            // if error (either wrong datatype or user does not exist)
        })
    })
}

function insertCategory(dashboardID, categoryName){

    return new Promise((resolve, reject) =>  connection.query("INSERT INTO todoapp.category (categoryName,dashboardId) VALUES (?,?); SELECT LAST_INSERT_ID()  ",[categoryName,dashboardID], function(err,sqlResponse){// response from DB

        if (err) {
            reject(err);
        };
        resolve(sqlResponse);
        // if no error successfully inserted
        // if error (either wrong datatype or user does not exist)
    }))

}

function insertTask(description, title, categoryID){

    connection.query("INSERT INTO todoapp.task (description,title,categoryID) VALUES (?,?,?) ",[description,title,categoryID], function(err,sqlResponse){// response from DB
        if (err) {

            console.log("Error inserting task");
        
            console.log(err);
            return null;
        };
        // if no error successfully inserted
        // if error (either wrong datatype or user does not exist)
    })
}

// saves all data of JSOn object to DB
function handleDashBoard(user, date, categories){

    insertDashboard(user,date)
        .then(sqlResponse => {

            dashboardID = sqlResponse[0].insertId;
            
            Object.entries(categories).forEach((element) =>{

                let categoryname = element[1].categoryName;
                let tasks = element[1].tasks;

                insertCategory(dashboardID, categoryname)
                    .then(sqlResponse =>{

                        console.log(sqlResponse + "RES2");

                        let categoryID = sqlResponse[0].insertId;

                        Object.entries(tasks).forEach((task) =>{

                           
                            let taskDescription = task[1].taskDescription;
                            let taskNote = task[1].note;

                            insertTask(taskNote,taskDescription,categoryID);            
                        })

                    })
                    .catch(err=>{
                        throw(err);
                    });
            })

        })
        .catch(err=>{
            throw(err);
        });
  



}





app.get('/product/:id' , (req, res) => {// response we send as get
    const { id } = req.params;
        // connection.escape is the prepared statement
        connection.query("SELECT * from webstore.product p WHERE p.productid ="+ connection.escape(id) , function(err,response){// response from DB
    
            if(err) throw err;

            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(response));
            res.send();
            
        })
});    

app.post('/tshirt/:id', (req,res) => {
    const { id } = req.params;
    const { logo } = req.body;

    if(!logo){
        res.status(418).send({ message: 'We need a logo!' })
    }
    res.send({
        tshirt: `tshirt with your ${logo} and ID of ${id} `,
    })

})
