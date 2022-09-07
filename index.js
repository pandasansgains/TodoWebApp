

const express = require('express');
const mysql = require('mysql'); // mysql library
const path = require('path')
const config = require('config');// reference to config file
const http = require('http');
const bodyParser = require('body-parser'); // so we can read encoded forms ( necessary for form)
const session = require('express-session');// so we can have session cookies for auth
const validator = require('email-validator');// so we can validate emails 
const bcrypt = require('bcrypt');
const { response } = require('express');
const { has } = require('config');



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
	resave: false,
	saveUninitialized: true,
    cookie : {maxAge: 1000*60*24*24},// one day
    loggedin : false,
    username : ""
}));

app.listen(

    PORT,
    () => console.log(`it's alive on  http://localhost:${PORT}`)

)

//base url
app.get('/',function(req,res) { // to open the main file 

  
    // res.render('register');

    var session = req.session;
    
    if(session.loggedin){
        res.render('main',{status : "logged in as :" + session.username});
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


// login page called when clicked . how to call it from html ? should i make a request or 
// can i leave it as href
app.get('/register',function(req,res) { // to open the main file 
    res.render("register");
});


app.post('/auth', urlEncodedParser , (req,res) =>{

    var username = req.body.username;
    var password = req.body.password;

    var session = req.session;

    if(username && password){ // checking for empty fields


        connection.query("SELECT * from todoapp.credentials p WHERE p.Username ="+ connection.escape(username) , function(err,sqlResponse){// response from DB
    

            if(err) throw err;

            if(sqlResponse.length > 0){ // at least one matching password

                
                console.log(sqlResponse);

                let hash = sqlResponse[0].Password;

                console.log(hash);

                // get password from DB and compare with hashed 

                bcrypt.compare(password, hash)
                .then(result =>{
                    
                    //TODO fix security
                    session.loggedin = true;
                    session.username = username;

                    res.redirect('/');
                })
                .catch(err => {
                    console.log(err)
                })
            }
            else{// no account matching 
                res.render('login', {connectionStatus: "Password or Login incorrect. Please enter Username and Password"});
            }

        })
    } 
    else{// TODO if wrong we need to display the thing

        res.render('login', {connectionStatus: "Please enter Username and Password"});
        res.end;
    }
})


app.post('/register', urlEncodedParser , (req,res) =>{

    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.confirm;

    console.log(req.body);

    console.log(email, password, confirm);

    if(email && password && confirm){ // checking for empty fields

        var validatedEmail = validator.validate(email);// boolean for validation of email

        if(password === confirm && (validatedEmail)){// valid email and password and confirm match


            connection.query("SELECT * from todoapp.credentials p WHERE p.Username ="+ connection.escape(email), function(err,sqlResponse){// response from DB
    
                if(err) throw err;
    
                if(sqlResponse.length > 0){ // at least one matching account


                    res.end;// render page with "already existing account"
    
                    
                }
                else{// no account matching 

                    bcrypt.hash(password, 10)// 10 cycles of salt
                    .then(hash => {

                        connection.query( "INSERT INTO todoapp.credentials (Username,Password) VALUES (?,?)",[email,hash], function(err,sqlResponse){


                            res.render('login', {connectionStatus: "Enter Email and Password"});


                        })
                        // insert hash in the database with email
        
                    })
                    .catch(err => {
                        console.log(err)
                    })
    
                }
            })
            // check if not an already existing account is there 

           

            // hash and store if does not exists for one email already
        }
        
        else{
            res.send("Invalid email or passwords not matching");// redirect and alert this text
        }
    } 
    else{// TODO if wrong we need to display the thing

        // render that there is an error in fields
        res.send("Fill all releveant fields");// redirect and alert this text
        
    }
})


function compareHash(){
    
    bcrypt.compare(password,hash)
    .then(result =>{
        console.log(result , " matching");
    })
    .catch(err => {
        console.log(err)
    })
}

app.post('/logout',function(req,res){

    console.log("reached");

    var session = req.session;

    if(session.loggedin){

      

        console.log(session);


        session.loggedin = false;
        session.username = "";
        
        session.destroy();

        console.log(session);
        res.render('main', {status : ""});
        res.end;

    }

})


//LOAD DATES OF ALL PLANNINGS IF LOGGED IN
app.get('/plannings', (req,res)=>{

    // provides all the dates of saved dashboards for given username and then another request will fetch for certain user and certain date
    const  username  = req.session.username;
    if(req.session.loggedin ){// logged in and username is valid

        connection.query("SELECT d.date from todoapp.dashboard d WHERE d.user = ?",[username], function(err,sqlResponse){// response from DB

            if (err) {
                throw(err);// so we can send response handling the catch
            }

            res.send(JSON.stringify(sqlResponse));// here the value is undefined
          
        })
    }
    else{
        res.send("Not Logged In");
    }

})

// GET ONE SPECIFIC DASHBOARD ID BY DATE ONLY IF LOGGED IN
app.get('/plannings/:date', (req,res) =>{

    const {date} = req.params;

    
    console.log(date);
    var jsonOut = {};


    if(req.session.loggedin){

        // final variables where we return data
        var categoriesOUT = null;
        var tasksOUT = null;

        const username = req.session.username;

        // GETS ID OF DASHBOARD FOR date and username
        getDashboardId(String(date),username)
            .then((sqlResponse) =>{ 

                let dashboardId = null;
            
                if(sqlResponse[0] != undefined){
                   dashboardId = sqlResponse[0].dashboardId;
                }
                getCategories(dashboardId)
                    .then((categorySqlResponse) => {

                        categoriesOUT = categorySqlResponse; // saving for OUT

                        const categories = Object.values(JSON.parse(JSON.stringify(categorySqlResponse)));// TODO access right ID
                        const promises = [];

                        // [
                        //     RowDataPacket { categoryName: 'c1', categoryID: 1, dashboardId: 1 },
                        //     RowDataPacket { categoryName: 'c2', categoryID: 2, dashboardId: 1 },
                        //     RowDataPacket { categoryName: 'c3', categoryID: 3, dashboardId: 1 }
                        // ] categorySqlResponse[0].categoryName  = 'c1'
        
                        Object.entries(categories).forEach((category) =>{
                            // todo error over iterations
                            //[ '0', { categoryName: 'c1', categoryID: 1, dashboardId: 1 } ]
                            let categoryID = category[1].categoryID; // TODO access right ID
                            promises.push(getTasks(categoryID)); //adding the promises
                        })
        
                        // //Executed when all tasks are fetched for all categories
                        Promise.all(promises).then((values)=> {

                            tasksOUT = values;// saving for OUT
                            jsonOut.categories = categoriesOUT;
                            jsonOut.tasks = tasksOUT;
                            // TODO add dashboard DATA if we need it 
                            res.send(JSON.stringify(jsonOut)); // sending data from db
                        })
        
                    })
                    .catch((err) =>{throw (err)})
               
                //ID in sqlResponse
            })
            
        .catch((err) =>{throw (err)})
    }
    else{
        res.send("Not logged In, cannot access data");
    }

})



// DELETE A DASHBOARD
app.post('/plannings/:date', (req,res) =>{

    let username = req.session.username;
    const {date} = req.params;

    if(req.session.loggedin){

        //deleteDashboard()

        deleteDashboard(date,username);
    }

})
    

// SAVE A PLANNING
app.post('/planning', (req, res) => {

    const jsonObj = req.body;

    let username = req.session.username;
    let date = jsonObj.date;
    let categories = jsonObj.categories; // each category has a list of tasks
 
    if(req.session.loggedin){ // session is active

        handleDashBoard(username,date,categories);

    }
    else{
        res.send("Not logged in, we cannot save.");
    }
})


function insertDashboard(user,date){

    //TODO delete dashboard first then insert
    return new Promise(( resolve,reject) =>{ connection.query("REPLACE INTO todoapp.dashboard (user,date) values (?, ?); SELECT LAST_INSERT_ID()",[user,date], function(err,sqlResponse){// response from DB

            if (err) {
                reject(err);
            }
            resolve(sqlResponse);
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

//TODO RENAME
// SAVES ALL DATA OF 1 DASHBOARD (FORMAT.JSON) TO DB
function handleDashBoard(user, date, categories){

    insertDashboard(user,date)
        .then(sqlResponse => {

            dashboardID = sqlResponse[0].insertId;
            
            Object.entries(categories).forEach((element) =>{

                let categoryname = element[1].categoryName;
                let tasks = element[1].tasks;

                insertCategory(dashboardID, categoryname)
                    .then(sqlResponse =>{

                        let categoryID = sqlResponse[0].insertId;

                        Object.entries(tasks).forEach((task) =>{

                           
                            let taskDescription = task[1].taskDescription;
                            let taskNote = task[1].note;

                            insertTask(taskNote,taskDescription,categoryID);  
                            
                            
                        })

                    })
                    .catch(err=>{
                        console.log(err)
                    });
            })

        })
        .catch(err=>{
            console.log(err)
        });
 
}

// PROMISE RETURNS 1 dashboard ID
function getDashboardId(date, username){
        // gets dashboarID
        return new Promise((resolve,reject) =>{ connection.query("SELECT d.dashboardId from todoapp.dashboard d WHERE d.user = ? AND d.date = ?;",[username,date], function(err,sqlResponse){// response from DB

            if (err) {
                reject(res);// so we can send response handling the catch
            }
            resolve(sqlResponse);   
        })
    })
}


// DELETES A DASHBOARD FOR DATE USERNAME
function deleteDashboard(date, username){

    connection.query("DELETE FROM todoapp.dashboard d WHERE d.date = ? and d.user = ?",[date,username], function(err,sqlResponse){// response from DB
       
       if(err){
        throw err;
       }
       console.log("DELETED")
     
    })

}

// RETURNS ALL CATEGORIES ASSOCIATED TO 1 DASHBOARD
function getCategories(dashboardID){

    return new Promise((resolve,reject) =>{ connection.query("SELECT c.* from todoapp.category c WHERE c.dashboardId = ?;",[dashboardID], function(err,sqlResponse){// response from DB

        if (err) {
            reject(err);// so we can send response handling the catch
        }
        resolve(sqlResponse);
    })
})}

// RETURNS ALL TASKS ASSOCIATED TO 1 CATEGORY
function getTasks(categoryID){

    return new Promise((resolve,reject) =>{ connection.query("SELECT t.* from todoapp.task t WHERE t.categoryId = ?;",[categoryID], function(err,sqlResponse){// response from DB
        if (err) {
            reject(res);// so we can send response handling the catch
        }
        console.log(sqlResponse + "----------");
        resolve(sqlResponse);
     
    })})
}


