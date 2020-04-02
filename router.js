module.exports = function(app, fs, path, getIP, axios, si, time, mysql, crypto, mysql_connection, ip_mysql, pw_security, mysql_query, async, makeid, getTime) {
    
    
    // custom array.prototype declaration
    
    Array.prototype.jsonIncludes = function (key, values, options) {
        let option;
        options == undefined ? option = {} : option = options;
        let thisGlob = this;
        let returnobj = [];
        thisGlob.filter((obj) => {
            if (obj[key] == values) {
                switch (option.output) {
                    case "object":
                        returnobj.push(obj);
                    default:
                        returnobj.push(thisGlob.indexOf(obj));
                }
            }
        });
        if (option.output == "object") return returnobj;
        else return (returnobj.toString() == "" ? -1 : returnobj.toString());
    }
    
    
    // specific product info loading
    
    function getProdData(i, prodlist, savepoint) {
        return new Promise((resolve, reject) => {
            // console.log(prodlist[i]);
            // console.log(savepoint);
            if (savepoint.jsonIncludes("barcode", prodlist[i]) == -1) {
                mysql_query("SELECT * FROM product WHERE barcode='" + prodlist[i] + "'")
                .then((res_sql) => {
                    // console.log(res_sql);
                    if (res_sql.length > 0) {
                        let data = res_sql[0];
                        data.num = 1;
                        // console.log(data);
                        savepoint.push(data);
                    }
                    if (i < prodlist.length-1) {
                        getProdData(++i, prodlist, savepoint)
                        .then((resolved) => {
                            resolve(resolved);
                        })
                    } else {
                        resolve(savepoint);
                    }
                })
            } else {
                // console.log(savepoint.jsonIncludes("barcode", prodlist[i]));
                savepoint[savepoint.jsonIncludes("barcode", prodlist[i])].num++;
                if (i < prodlist.length-1) {
                    getProdData(++i, prodlist, savepoint)
                    .then((resolved) => {
                        resolve(resolved);
                    })
                } else {
                    resolve(savepoint);
                }
            }
        })
    }
    
    function getSpecProd(user, location, prodarr) {
        return new Promise((resolve, reject) => {
            // console.log(user);
            async.waterfall([
                (callback) => {
                    if (user == undefined || user == null) {
                        reject("ERR: NOT LOGINED");
                    } else {
                        callback(null, user);
                    }
                },
                (uinfo, callback) => {
                    let prodSList = [];
                    if (location == "cart") {
                        mysql_query("SELECT * FROM cart WHERE userid='" + uinfo.id + "'")
                        .then((res_sql) => {
                            // console.log(res_sql);
                            if (res_sql.length <= 0) {
                                resolve([]);
                            } else {
                                callback(null, uinfo, res_sql[0].cartInfo.split(","));
                            }
                        })
                    } else {
                        callback(null, uinfo, prodarr);
                    }
                },
                (uinfo, prodarr, callback) => {
                    getProdData(0, prodarr, [])
                    .then((specData) => {
                        // console.log(specData);
                        callback(null, specData);
                    })
                }
            ], (err, result) => {
                resolve(result);
            })
        })
    }

    // get router

    //main page
    app.get('/', function(req, res) {
        // res.end('server loaded');
        console.log("Page approached: index");
        if(req.session.user) {
            // getSpecProd("cart");
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


    // community page
    app.get('/community', function(req, res) {
        console.log("Page approached: community");
        res.render("community1.html", {
            status: req.session.user == undefined ? false : true
        });
    })

    app.get('/community/wfarm', function(req, res) {
        console.log("Page approached: community/wfarm");
        res.render("community2.html", {
            status: req.session.user == undefined ? false : true
        });
    })

    // order page
    app.get('/order', function(req, res) {
        console.log("Page approached: order");
        let prod_data;

        if (req.session != undefined && req.session.user != undefined) {
            //     name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g",
            //     price: 8760,
            //     prodid: "c3018582834",
            //     deliverCharge: 2500
            // },
            // {
            //     name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g * 2",
            //     price: 10000,
            //     prodid: "c3018582834",
            //     deliverCharge: 2500
            // },
            // {
            //     name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g * 3",
            //     price: 25000,
            //     prodid: "c3018582834",
            //     deliverCharge: 2500
            // }]
            mysql_query("SELECT * FROM product")
            .then((res_sql) => {
                res.render("order.html", {
                    prod: res_sql,
                    uinfo: req.session.user,
                    status: true
                });
            })
            .catch((e) => {
                console.error(e);
                res.redirect('/');
            })
        } else {
            res.redirect('/login');
        }
    });



    // cart page
    app.get('/cart', function(req, res) {
        console.log("Page approached: cart");
        if (req.session != undefined && req.session.user != undefined) {
            getSpecProd(req.session.user, "cart")
            .then((res_cart) => {
                res.render("cart.html", {
                    status: true,
                    uinfo: req.session.user,
                    cart: res_cart
                });
            })
            .catch((e) => {
                console.error(e);
            })
        } else {
            res.statusCode = 302;
            res.setHeader('Location', '/login');
            res.end();
        }
    })


    // product specific page
    app.get('/spec', function(req, res) {
        const query = req.query;
        let status;
        if (req.session != undefined && req.session.user != undefined) {
            status = true;
        } else {
            status = false;
        }

        if (query.prodid == undefined) {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        } else {
            console.log("Page approached: spec (" + query.prodid + ")");

            // let prod_data;

            mysql_query("SELECT * FROM product WHERE barcode='" + query.prodid + "'")
            .then((prod_data) => {
                res.render("prod_spec.html", {
                    prod_data: prod_data[0],
                    status
                });
            })
            // prod_data = {
            //     name: "한국디지털미디어고등학교 스마트팜 무농약 당일재배 상추 60g",
            //     price: 8760,
            //     prodid: "c3018582834",
            //     deliverCharge: 2500
            // }
        }
    })


    // payment page
    app.get('/payment/:type', function(req, res) {
        const query = req.query;
        const params = req.params;
        let status;
        if (req.session != undefined && req.session.user != undefined) {
            status = true;

            if (query.paymid == undefined) {
                console.log("Page approached: payment - payment key making");
                const paym_id = "pay-" + makeid(16, "num");
                let cartInfo;
                if (params.type == "cart") {
                    mysql_query("SELECT * FROM cart WHERE userid='" + req.session.user.id + "'")
                    .then((res_sql) => {
                        mysql_query("INSERT INTO payment (paydate, Fuserip, userid, payid, paylist) VALUES ('" + getTime() + "', '" + getIP(req).clientIp + "', '" + req.session.user.id + "', '" + paym_id + "', '" + res_sql[0].cartInfo + "')");
                        res.redirect('/payment/id?paymid=' + paym_id);
                    })
                } else {
                    mysql_query("INSERT INTO payment (paydate, Fuserip, userid, payid, paylist) VALUES ('" + getTime() + "', '" + getIP(req).clientIp + "', '" + req.session.user.id + "', '" + paym_id + "', '" + query.prodlist + "')");
                    res.redirect('/payment/id?paymid=' + paym_id);
                }
            } else {
                console.log("Page approached: payment (" + query.paymid + ")");

                let prodlist;

                mysql_query("SELECT paylist from payment WHERE payid='" + query.paymid + "'")
                .then((res_sql) => {
                    if (res_sql.length == 0) {
                        res.end(`
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <script>
                                    alert("정상적인 결제id가 아닙니다."); 
                                    location.href = '/';
                                </script>
                            </head>
                        </html>
                        `);
                    } else {
                        // console.log(res_sql);
                        prodlist = res_sql[0].paylist.split(",");
                        getSpecProd(req.session.user, params.type, prodlist)
                        .then((res_spec) => {

                            let productInfo = res_spec;

                            let sum = 0;

                            // console.log(productInfo.length);

                            for (var j = 0; j < productInfo.length; j++) {
                                // console.log(j);
                                var price = productInfo[j].price * productInfo[j].num
                                var all = Math.floor(price /100 ) * 100
                                var sale = price - all;
                                productInfo[j].binfo = {
                                    price: productInfo[j].price,
                                    all,
                                    sale
                                }
                                // console.log(productInfo[j].binfo);
                                sum += all;
                            }
                            
                            let paym_data;
                            paym_data = {
                                paymId: query.paymid,
                                reqdate: getTime(),
                                productInfo,
                                sum
                            }
                
                            // console.log(paym_data);
                
                            res.render("payment.html", {
                                status,
                                paym_data
                            });
                        })
                        .catch((e) => {
                            console.error(e);
                        })
                    }
                })
            }


        } else {
            status = false;
            res.redirect('/login');
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
        
        // req.session.user = {
        //     name: "test",
        //     id: req.body.id,
        //     authorized: true
        // }

        req.session.user = {
            name: "test",
            id: "test",
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
        // console.log(req.session);
        req.session.destroy(function () {
            req.session;
        });
        // console.log(req.session);
        res.end();
    })

    //register(post) router

    app.post('/idCheckDup', (req, res) => {
        const user_id = req.body.userId;
        try {
            mysql_connection.query("Select * From user where userid = '" + user_id + "'", function(err_b, res_b, field_b) {
                if (res_b.length == 0) res.end("true");
                else return res.end("false");
            });
        } catch(e) {
            console.error(e);
            res.end("ERROR");
        }
    })

    // app.post('/register', function(req, res) {

    //     var result;
        
    //     //define sent information
    //     var user_id = req.body.id;
    //     var user_pw_unenc = req.body.pw;
    //     var user_name = req.body.name;
    //     var email = req.body.email;
    //     var pn = req.body.pn;
    //     var birth = req.body.b_day;
    //     var address = req.body.address;

    //     //connect db

    //     try {

    //         time_start = new Date().getTime();

    //         mysql_connection.query('SELECT * FROM user WHERE userid = "' + user_id + '"', async function(err, res, field) {
    //             if (err) throw err;
    //             if (res[0] == undefined) {
    //                 console.log('New register!');
    
    //                 //data encrypt
    //                 console.log("Start encrypting data");
    
    //                 //create random enc key
    
    //                 function make_enckey(length) {
    //                     var result = '';
    //                     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //                     var charactersLength = characters.length;
    //                     for ( var i = 0; i < length; i++ ) {
    //                     result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //                     }
    //                     return result;
    //                 }
                    
    //                 var enc_key = make_enckey(5);
                    
    //                 //1. pw
    
    //                 var passCipher = crypto.createCipher('aes-256-cbc', enc_key);
    //                 var enc_a_pw = passCipher.update(user_pw_unenc, 'utf-8', 'hex');
    //                 enc_a_pw += passCipher.final('hex');
    
    //                 var encrypt_pw = crypto.createHash('sha256');
    //                 encrypt_pw.update(enc_a_pw);
    //                 var user_pw_enc = encrypt_pw.digest('hex');

    //                 var date_registered = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
    
    //                 mysql_connection.query(`
    //                     Insert into user (
    //                         userid, 
    //                         password, 
    //                         name, 
    //                         email, 
    //                         phone, 
    //                         birth, 
    //                         address, 
    //                         registerdate,
    //                         usernum
    //                     ) values (
    //                         "` + user_id + `", 
    //                         "` + user_pw_enc + `", 
    //                         "` + user_name + `", 
    //                         "` + email + `", 
    //                         "` + pn + `", 
    //                         "` + birth + `", 
    //                         "` + address + `", 
    //                         "` + date_registered + `",
    //                         "` + 0 + `")
    //                     `), function(err, res, fields) {
    //                     if (err) {
    //                         throw err;
    //                     } else {
    //                         console.log('complete');
    //                     }
    //                 }
    //                 result = {
    //                     result: "success",
    //                     reason: "none",
    //                     id: user_id
    //                 }
    
    //                 //define usernum
    
    //                 mysql_connection.query("Select * From user where userid = '" + user_id + "'", function(err_b, res_b, field_b) {
    
    //                     var usernum = new Date().getFullYear() + pn.split('-')[2] + new Date().getMonth() + res_b[0].id;

    //                     console.log("usernum: " + usernum);

    //                     mysql_connection.query("Update user set usernum = '" + usernum + "' where id = '" + res_b[0].id + "'" , function(err, res_c, field_c) {
    //                         if (err) throw err;
    //                         console.log("All stage is ended successfully - Register new user");
    //                     })
    //                 });

    //                 //enc key record

    //                 // 반드시 실서비스 실행시 db 접근 가능 계정을 localhost로만 접속가능하도록 할것 (=sec_dbacc);
                    
    //                 //check db access information

    //                 var login_enc_connection = mysql.createConnection({
    //                     host: ip_mysql,
    //                     user: "sec_dbacc",
    //                     password: pw_mysql_sec,
    //                     database: 'assertive_sec'
    //                 })
    //                 login_enc_connection.query("Insert into login_enc values (" + 
    //                 userid + ", " + 
    //                 getIP(req).clientIP + ", " + 
    //                 date_registered + ", " + 
    //                 enc_key + ")", function(err_enckey, res_enckey, fields_enckey) {
    //                     if (err_enckey) {
    //                         console.log("Error while writing enckey at db");
    //                         console.log("Delete user: " + user_id);

    //                         mysql_connection.query("delete from user which user")
    //                     }
    //                     console.log(res_enckey);
    //                     console.log("Complete to write encrypt key at db");
    //                 });

    
    //             } else {
    //                 console.log('ID Duplicate!! \n id: ' + user_id);
    //                 result = {
    //                     result: "error",
    //                     reason: "id_duplicate",
    //                     id: user_id
    //                 }
    //             }
    
    //         });
        
    //         time_elapsed = new Date().getTime() - time_start;
    //         // console.log("회원가입 요청 소요된 시간: " + time_elapsed);
    //         console.log(
    //             `Complete Registering user: ` + user_id +
    //             `Register Time: ` + date_registered
    //         );
    //         setTimeout(() => {
    //             res.json(result);
    //         }, time_elapsed + 100);

    //     } catch(e) {
            
    //         console.log(`
    //         Error occured while registering new user.
    //         user name: ` + user_name + `,
    //         user email: ` + email + `,
    //         `);

    //         res.end("Error occured while registering new user");

    //         throw e;
    //     }
    // })


    app.post('/register', (req, res) => {
        const userid = req.body.id,
        pw = req.body.pw,
        name = req.body.name,
        email = req.body.email,
        pn = req.body.pn,
        b_day = req.body.b_day,
        address = req.body.address;

        // pw encrypt
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
        // cart.push(cart_insert);

        if (req.session.user != undefined || req.session.user != null || req.session.user != {}) {
            mysql_query("SELECT * FROM cart WHERE userid='" + req.session.user.id + "'")
            .then((res_sql) => {
                // console.log(res_sql);
                if (res_sql.length == 0) {
                    mysql_query("INSERT INTO cart (userid, cartInfo) VALUES ('" + req.session.user.id + "', '" + cart_insert + "')")
                } else {
                    let origin = res_sql[0].cartInfo;
                    let pusher = origin.split(",");
                    pusher.push(cart_insert);
                    mysql_query("UPDATE cart SET cartInfo='" + pusher + "' WHERE userid='" + req.session.user.id + "'");
                }
                res.end("true");
            })
            .catch((e) => {
                console.error(e);
                res.redirect('/');
            })
        } else {
            res.redirect('/login');
        }

        // req.session.cart = cart;

        // console.log(req.session.cart)
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