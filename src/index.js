
const express = require('express');
const mysql = require('mysql'); // mysql library
const path = require('path')
const config = require('config');
const http = require('http');

const app = express();
const PORT = 8080;

const connection = mysql.createConnection({ // create connection

    host:  `${config.HOST}`,
    user: `${config.USER}`,
    password: `${config.PASSWORD}`

})

connection.connect(function(err){
    if (err) throw err;
})


app.use(express.json());


app.listen(

    PORT,
    () => console.log(`it's alive on  http://localhost:${PORT}`)

)


app.get('/',function(req,res) { // to open the main file 

    res.sendFile( __dirname + '/index.html'); // adding the 
});


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
