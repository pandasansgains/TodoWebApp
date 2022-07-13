// all DB handler functions

import config from 'config';
import mysql from 'mysql';


export class DBhandler {

    constructor(){
        this.connection= mysql.createConnection({ // create connection
            host:  `${config.HOST}`,
            user: `${config.USER}`,
            password: `${config.PASSWORD}`
    
        })
    }

    getConnection(){
        return this.connection;
    }


    connectDB(){
        this.connection.connect(function(err){
            if (err) throw err;
        })
    }

    closeConnection(){

        //this.connection.close();

    }


}



