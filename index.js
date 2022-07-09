
const express = require('express');
const mysql = require('mysql'); // mysql library
const path = require('path')
const config = require('config');

const app = express();
const PORT = 8080;
//ffffff

const num = 1;


const connection = mysql.createConnection({

    host:  `${config.HOST}`,
    user: `${config.USER}`,
    password: `${config.PASSWORD}`

})

app.use(express.json());


connection.connect(function(err){
    if (err) throw err;

    console.log("connected");

    connection.query("SELECT * FROM webstore.product" , function(err,res){

        if(err) throw err;

        console.log("result : " + JSON.stringify(res) ); // we can now retrieve from DB
    })

})


app.listen(

    PORT,
    () => console.log(`it's alive on  http://localhost:${PORT}`)

)


app.get('/tshirt' , (req, res) => {

    res.status(200).send({

        tshirt: 'Shirt',
        size: 'L'

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
