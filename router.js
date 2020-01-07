module.exports = function(app, fs, path, getIP, axios, si, time, mysql, crypto, mysql_connection, ip_mysql, pw_security) {


    //mysql tools (not completely developed!!)


    function query_mysql(command) {
        console.log('query_mysql');
        mysql_connection.query(command, function(err, res, fields) {
            if (err) {
                throw err;
            } else {
                // console.log(`
                //     --------- response: ------
                // `);
                // for (var i = 0; i < res.length; i++) {
                //     console.log(res[i]);
                // }
                console.log("OK");
                // console.log(res);
                return res;
            }
        });
    }

    function getFormatDate(date){ 
        var year = date.getFullYear();	//yyyy
        var month = (1 + date.getMonth());	//M 
        month = month >= 10 ? month : '0' + month;	//month 두자리로 저장 
        var day = date.getDate();	//d
        day = day >= 10 ? day : '0' + day;	//day 두자리로 저장 
        return year + '' + month + '' + day; 
    }



    //get router



    //main page
    app.get('/', function(req, res) {
        // res.end('server loaded');
        console.log("Page approached: index");
        if(req.session.user) {
            res.render("index.html", {
                status: true,
                uinfo: req.session.user
            });
        } else {
            res.render("index.html", {
                status: false
            });
        }
        
    })

    //login page
    app.get('/login', function(req, res) {
        console.log("Page approached: login");
        if(req.session.user) {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        } else {
            res.render("login.html");
        }
    })


    //register page
    app.get('/register', function(req, res) {
        console.log("Page approached: register");
        res.render("register.html");
    })


    //community page
    app.get('/community', function(req, res) {
        console.log("Page approached: community");
        res.render("community1.html");
    })

    app.get('/community/wfarm', function(req, res) {
        console.log("Page approached: community/wfarm");
        res.render("community2.html");
    })

    //order page
    app.get('/order', function(req, res) {
        console.log("Page approached: order");
        let prod_data;

        if (req.session != undefined && req.session.user != undefined) {
            prod_data = [{
                name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g",
                price: 8760,
                prodid: "c3018582834",
                deliverCharge: 2500
            },
            {
                name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g * 2",
                price: 10000,
                prodid: "c3018582834",
                deliverCharge: 2500
            },
            {
                name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g * 3",
                price: 25000,
                prodid: "c3018582834",
                deliverCharge: 2500
            }]
            res.render("order.html", {
                prod: prod_data,
                uinfo: req.session.user,
                status: true
            });   
        } else {
            res.statusCode = 302;
            res.setHeader('Location', '/login');
            res.end();
        }
    });




    app.get('/cart', function(req, res) {
        console.log("Page approached:c cart");
        if (req.session != undefined && req.session.user != undefined) {
            res.render("cart.html", {
                status: true,
                uinfo: req.session.user
            });   
        } else {
            res.statusCode = 302;
            res.setHeader('Location', '/login');
            res.end();
        }
    })










    //post edit page

    //




    //post router




    //login(post) router

    // 로그인값 받아와서 pw를 'assertive_sec' db에 'login_enc' 테이블에서 로그인id로 등록된 암호화 키를 찾고 그걸로 암호화를 진행 (암호화는 아래 register와 동일하게 할것)
    // 입력 pw와  'user' 테이블의 pw가 같은지 비교. 같으면 session에 로그인 세션 등록.
    // 틀리면 error 반환

    // + 'assertive_sec' db는 1개의 전용 계정으로만 접근 가능함. 관련 코드 첨부.

    // var login_enc_connection = mysql.createConnection({
    //     host: ip_mysql,
    //     user: "sec_dbacc",
    //     password: pw_mysql_sec,
    //     database: 'assertive_sec'
    // })

    // login_enc_connection.query([commands], function(err, res, fields) {
        
    // })
    

    app.post('/login', function(req, res) {

        // var result;
        
        // // define sent information
        // var id_input = req.body.id;
        // var pw_input = req.body.pw;
        
        // //pw encrypy

        // var login_enc_connection = mysql.createConnection({
        //     host: ip_mysql,
        //     user: "sec_dbacc",
        //     password: pw_mysql_sec,
        //     database: 'assertive_sec'
        // })

        // login_enc_connection.query([commands], function (err, res, fields) {
        //     if (err) throw err;

        //     if (!res[0]) return res.render('login', { message: 'please check your id' });

        //     var user = res[0];
        //     function make_enckey(length) {
        //         var result = '';
        //         var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //         var charactersLength = characters.length;
        //         for (var i = 0; i < length; i++) {
        //             result += characters.charAt(Math.floor(Math.random() * charactersLength));
        //         }
        //         return result;
        //     }

        //     var enc_key = make_enckey(5);

        //     var passCipher = crypto.createCipher('aes-256-cbc', enc_key);
        //     var enc_a_pw = passCipher.update(user_pw_unenc, 'utf-8', 'hex');
        //     enc_a_pw += passCipher.final('hex');

        //     var encrypt_pw = crypto.createHash('sha256');
        //     encrypt_pw.update(enc_a_pw);
        //     var user_pw_enc = encrypt_pw.digest('hex');

        //     mysql_connection.query(`SELECT * FROM user WHERE id=`+id_input), function (err, res, fields) {
        //         if (err) {
        //             throw err;
        //         } else {
        //             req.session.user = {
        //                 id: id_input,
        //                 pw: pw_input,
        //                 authorized: ture
        //             };
        //         }
        //     }

        // })
        
        req.session.user = {
            name: "test",
            id: req.body.id,
            authorized: true
        }

        res.json({
            yn: true,
            test: true
        })
        
    })


    //logout(post) router

    app.post('/logout', function(req, res) {
        console.log("logout requested");
        console.log(req.session);
        req.session.destroy(function () {
            req.session;
        });
        console.log(req.session);
        res.end();
    })

    //register(post) router

    app.post('/register', function(req, res) {

        var result;
        
        //define sent information
        var user_id = req.body.id;
        var user_pw_unenc = req.body.pw;
        var user_name = req.body.name;
        var email = req.body.email;
        var pn = req.body.pn;
        var birth = req.body.b_day;
        var address = req.body.address;

        //connect db

        try {

            time_start = new Date().getTime();

            mysql_connection.query('SELECT * FROM user WHERE userid = "' + user_id + '"', async function(err, res, field) {
                if (err) throw err;
                if (res[0] == undefined) {
                    console.log('New register!');
    
                    //data encrypt
                    console.log("Start encrypting data");
    
                    //create random enc key
    
                    function make_enckey(length) {
                        var result = '';
                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < length; i++ ) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        return result;
                    }
                    
                    var enc_key = make_enckey(5);
                    
                    //1. pw
    
                    var passCipher = crypto.createCipher('aes-256-cbc', enc_key);
                    var enc_a_pw = passCipher.update(user_pw_unenc, 'utf-8', 'hex');
                    enc_a_pw += passCipher.final('hex');
    
                    var encrypt_pw = crypto.createHash('sha256');
                    encrypt_pw.update(enc_a_pw);
                    var user_pw_enc = encrypt_pw.digest('hex');

                    var date_registered = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
    
                    mysql_connection.query(`
                        Insert into user (
                            userid, 
                            password, 
                            name, 
                            email, 
                            phone, 
                            birth, 
                            address, 
                            registerdate,
                            usernum
                        ) values (
                            "` + user_id + `", 
                            "` + user_pw_enc + `", 
                            "` + user_name + `", 
                            "` + email + `", 
                            "` + pn + `", 
                            "` + birth + `", 
                            "` + address + `", 
                            "` + date_registered + `",
                            "` + 0 + `")
                        `), function(err, res, fields) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('complete');
                        }
                    }
                    result = {
                        result: "success",
                        reason: "none",
                        id: user_id
                    }
    
                    //define usernum
    
                    mysql_connection.query("Select * From user where userid = '" + user_id + "'", function(err_b, res_b, field_b) {
    
                        var usernum = new Date().getFullYear() + pn.split('-')[2] + new Date().getMonth() + res_b[0].id;

                        console.log("usernum: " + usernum);

                        mysql_connection.query("Update user set usernum = '" + usernum + "' where id = '" + res_b[0].id + "'" , function(err, res_c, field_c) {
                            if (err) throw err;
                            console.log("All stage is ended successfully - Register new user");
                        })
                    });

                    //enc key record

                    // 반드시 실서비스 실행시 db 접근 가능 계정을 localhost로만 접속가능하도록 할것 (=sec_dbacc);
                    
                    //check db access information

                    var login_enc_connection = mysql.createConnection({
                        host: ip_mysql,
                        user: "sec_dbacc",
                        password: pw_mysql_sec,
                        database: 'assertive_sec'
                    })
                    login_enc_connection.query("Insert into login_enc values (" + 
                    userid + ", " + 
                    getIP(req).clientIP + ", " + 
                    date_registered + ", " + 
                    enc_key + ")", function(err_enckey, res_enckey, fields_enckey) {
                        if (err_enckey) {
                            console.log("Error while writing enckey at db");
                            console.log("Delete user: " + user_id);

                            mysql_connection.query("delete from user which user")
                        }
                        console.log(res_enckey);
                        console.log("Complete to write encrypt key at db");
                    });

    
                } else {
                    console.log('ID Duplicate!! \n id: ' + user_id);
                    result = {
                        result: "error",
                        reason: "id_duplicate",
                        id: user_id
                    }
                }
    
            });
        
            time_elapsed = new Date().getTime() - time_start;
            // console.log("회원가입 요청 소요된 시간: " + time_elapsed);
            console.log(
                `Complete Registering user: ` + user_id +
                `Register Time: ` + date_registered
            );
            setTimeout(() => {
                res.json(result);
            }, time_elapsed + 100);

        } catch(e) {
            
            console.log(`
            Error occured while registering new user.
            user name: ` + user_name + `,
            user email: ` + email + `,
            `);

            res.end("Error occured while registering new user");

            throw e;
        }
    })

    //posting(post) router

    app.post('/add_post', function(req, res) {
        
    });

    // card router

    // 상품명 조건: 보낼때 상품명 앞에 p_ 붙어야 인식함

    app.post('/load_cart', function(req, res) {
        res.json({
            data: req.session.cart
        })
    });
    
    app.post('/add_cart', function(req, res) {
        var cart_insert = req.body.cart_insert; // String
        var cart = req.session.cart;
        if (cart == undefined) {
            cart = [];
        }
        cart.push(cart_insert);

        req.session.cart = cart;

        console.log(req.session.cart)

        res.end("true");
    })

    app.post('/reset_cart', function(req, res) {
        req.session.cart = [];
        console.log("cart reset");
        res.end("cart reset");
    })

    //payment(post) router



    app.post('/test_payment', function(req, res) {
        axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: '5158313952849077',
            imp_secret: 'uNX9N7Iihf8FmtBWJqpEvcpzi4SIWX3qK0zx8hQpxZ4UsFQc5gQBsfaLj3tg0wGLxfiFx95589ZBPQNV'
        })
        .then(function(response) {
            console.log(response.data.response);
            res.end(response.data.response.access_token);
        })
    })


    app.post('/payment_onetime', async function(req, res) {

        //define sent information

        var pay_amount = req.body.pay_amount;
        var selected_payment = req.body.selected_payment;

        var selected_payment_auth = false;

        if (selected_payment == 'card') {

            //카드 결제

            if (selected_payment_auth == true) {

                //인증 결제

                //카드사 결제창 표시

                    //JSP 결제서버로 전환

                


            } else if (selected_payment_auth == false) {

                //비인증 결제

                var card_num = req.body.card_num;
                var card_expire_m = req.body.expire_m;
                var card_expire_y = req.body.expire_y;
                var card_pw = req.body.card_pw;
                var card_cvc = req.body.cvc;
                var card_owner = req.body.owner_name;
                var owner_pn = req.body.pn;

                var user_id = req.body.id;

                //define payment array

                var payment_req = {
                    card_number: card_num,
                    card_expire: card_expire_y + '-' + card_expire_m,
                    card_pw: card_pw,
                    card_cvc: card_cvc,
                    card_owner: card_owner,
                    card_owner_pn: owner_pn,
                    
                };

                //payment start

                //1. 인증

                var access_token = '';

                axios.post('https://api.iamport.kr/users/getToken', {
                    imp_key: '',
                    imp_secret: ''
                })
                .then(function(response) {
                    console.log(response.data.response);
                    access_token = response.data.response;
                })

                //2. 결제요청 기록

                var num_paymented;
                
                await mysql_connection.query('Select * from payment_total where id="' + user_id + '"',  function(err, res, fields) {
                    if (err) throw err;
                    num_paymented = res.length;
                })

                var num_paymented_real = parseInt(num_paymented) + 1;

                
                await mysql_connection.query(
                    "insert into payment_total values (" 
                    + time + 
                    ", " + 
                    getIP(req).clientIP + 
                    ", " + 
                    user_id + 
                    ", " + 
                    "card" + 
                    ", " +
                    1 +
                    ", " + 
                    user_id + "_" + time + "_c_s" + num_paymented_real
                    + ")", function(err_log_payment, res_log_payment, fields_log_payment) {
                        if (err_log_payment) throw err_log_payment;
                    }
                );



                //3. 결제

                axios.post('https://api.iamport.kr/subscribe/payments/onetime', {
                    merchant_uid: '',
                    amount: '',
                    card_number: payment_req.card_number,
                    expiry: payment_req
                })
                .then(function(response) {
                    console.log(response.data.response);
                    access_token = response.data.response;
                })

            }

            //4. 결제완료 기록 / 결제 실패 기록

        } else if (selected_payment == 'cash_vaccount') {

            //가상계좌 결제


        } else if (selected_payment == 'cash_naccount') {

            //무통장 입금

        } else {
            console.log("Non-supported payment type");
            console.log(selected_payment);
            res.end();
        }

        if (card_expire_m < 10) {
            card_expire_m = '0' + card_expire_m;
        }


    });




    //db management tools

    //db auto backup code

    app.post('/backup_db', function(req, res) {
        var db_name = req.body.db_name;
        console.log("Start to backup " + db_name);

        if (db_name == "assertive") {
            query_mysql("")
        }
    })

    //db commandline tool

    // var async = require('async');

    app.post('/command_db', async function(req, res) {
        var db = req.body.db;
        var command = req.body.command;
        var i = 0;
        
        if (db == "assertive") {
            console.log('command line requested');
            

        } else {
            console.log('unidentified request');
            res.end("ERROR: DB NONE");
        }
    })

}