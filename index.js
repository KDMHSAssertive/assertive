//module load
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const getIP = require('ipware')().get_ip;
const crypto = require('crypto');
const axios = require('axios');
const mongoose = require('mongoose');
const async = require('async');
require('date-utils');

const app = express();

//server open
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 80;
const ip_local = "localhost";
const ip_outward = "1.242.22.109";
const ip_outward_b = "1.242.22.221";
const ip_outward_c = "121.170.91.55"
const ip = ip_outward_c;
const domain = 'http://sfam.shop';

const ip_mysql_real = "121.170.91.30";
const ip_mysql_local = "localhost";
const ip_mysql = ip_mysql_real;

// var mysql_connection = mysql.createConnection({
//     host: ip_mysql,
//     user: 'assertive_dimigo',
//     password: 'smartfarm123',
//     database: 'assertive'
// });


// mysql settings

var mysql_connection = mysql.createConnection({
    host: ip_mysql,
    user: 'foo',
    password: 'bar',
    database: 'assertive'
});

function mysql_query(q_comm) {
    return new Promise((resolve, reject) => {
        // mysql_connection.connect();
        mysql_connection.query(q_comm, (err, rows, fields) => {
            if (err) {
                reject("Query ERR: " + err);
            } else {
                resolve(rows);
            }
        })
        // mysql_connection.end();
    })
}

mysql_query("show tables")
.then((res) => {
    if (res.length != 0) {
        console.log("Connected to Mysql DB. Total table number is " + res.length);
    }
})
.catch((err) => {
    console.log(err);
})

// mysql settings

var pw_security;

setTimeout(() => {

    // if (ip == ip_local) {

    //     console.log('\x1b[34m%s\x1b[0m', `
        
    //                     Test System Server Start Running!!
    //                     Please remind that this change will not be effected all system!
        
    //     `);
        
    // } else {

    //     console.log('\x1b[31m%s\x1b[0m', `
        
    //                     Real System Server Start Running!!
    //                     Please remind that this change will be changed all system!
        
    //     `);

    // }

    // if (ip_mysql == ip_mysql_local) {

    //     console.log('\x1b[36m%s\x1b[0m', `
        
    //                     Successfully connected to Assertive DB

    //                     This DB is test DB.
    //                     All changes will not be affected at service!
    //     `);

    // } else if (ip_mysql == ip_mysql_real) {

    //     console.log('\x1b[31m%s\x1b[0m', `

    //                     Successfully connected to Assertive DB

    //                     Warning!!! This DB is real DB.
    //                     All changes will be affected at service!
    //     `);

    //     console.log("\n\n Starts to set new pw of mysql security server");

    //     //Make Random PW of security server

    //     // 실서비스시 아래의 pw_security 정의를 주석처리하고 아래 코드로 대체할 것
    //     // + 실서비스시 db암호 설정 계정을 localhost에서만 접속가능하도록 설정할 것 (=setter_security)

    //     // pw_security = '';
    //     // var length = '12';
    //     // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     // var charactersLength = characters.length;
    //     // for ( var i = 0; i < length; i++ ) {
    //     //     pw_security += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     // }

    //     // mysql.createConnection({host: ip_mysql, user: "setter_security", pw: "**&&**_sf_admin_mysql10_security_**&&**", database: "mysql"}).query('set password for "sec_dbacc"@"localhost" = ' + pw_security, function(err, res, fields) {
    //     //     if (err) {
    //     //         console.log("Error while setting security server");
    //     //         throw err;
    //     //     } else {
    //     //         console.log("Complete Setting Security Account");
    //     //         console.log(res);
    //     //     }
    //     // })

    //     pw_security = "abcdefg";

    // }

    const start_server = server.listen(port, ip, function() {
        
        console.log('\x1b[34m%s\x1b[0m', `
        
                        /* Developed at 2019. Based on Node.js */
                    /* ⓒ ASSERTIVE: Sale System Department 17th. */
                                /* All right researved. */
        
        `);
    
        setTimeout(() => {
            console.log( '\x1b[32m%s\x1b[0m', `
        
                                Korea Digital Media High School
    
                            Assertive: SmartFarm Management Club
            
            `);
        }, 700);
    
        setTimeout(() => {
            console.log(`
                -----| Korea Digital Media High School SmartFarm Online Market Server |-----
    
    
                            Server ip: ` + ip + `
                            Server port: ` + port + `
                            Server Link: http://` + ip + `:` + port + `
    
                            Registered Domain: ` + domain + `
                            Server Link #2: 
                            SSL Certificate: N/a
    
    
                -----| Korea Digital Media High School SmartFarm Online Market Server |-----
    
            `);
        }, 1100);
    });
}, 100);

let time = ''+new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds();


//webpage route setting
app.set('views', __dirname + "/front/html");
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, "/front")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//session setting
app.use(session({
    key: 'assertive_webmarket',
    secret: '!&^@#*$(%$#*)@#J$_H(%KGF$JH*%)$#I#)$FKassertive_@#^&GH%*(Y*U#$J@)FK(smartfarm_kdmhs_HQ(&#@%*GJ)FMWIwebmarket',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));



function makeid(length, type) {
    let characters;
    if (type == "num") {
        characters = '0123456789';
    } else {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }
    var result = '';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



function getTime() {
    var date = new Date().getDate();
    if (date < 10) {
        date = '0' + date
    }

    var month = new Date().getMonth()+1;
    if (month < 10) {
        month = '0' + month
    }

    var hour = new Date().getHours();
    if (hour < 10) {
        hour = '0' + hour
    }

    var minute = new Date().getMinutes();
    if (minute < 10) {
        minute = '0' + minute
    }

    var second = new Date().getSeconds();
    if (second < 10) {
        second = '0' + second
    }


    return '' + new Date().getFullYear() + month + date + "-" + hour + ":" + minute + ":" + second;
}

//router setting

var router = require('./router')(app, fs, path, getIP, axios, si, time, mysql, crypto, mysql_connection, ip_mysql, pw_security, mysql_query, async, makeid, getTime);

