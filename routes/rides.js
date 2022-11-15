const mysql = require('mysql');
const dbconfig = require('../config/database.js');
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  port : 8888,
  password : '1234',
  database : 'login_last'
});
connection.connect();
var express = require('express');
var router = express.Router();

router.post('/position', (request, response)=>{
	response.json(request.body); // or response.send(request.body);
});



router.get('/', function(req, res, next) {
  res.status(200).json(
    {
      "success" : true
    }
  );
});

router.get('/users_info', (req, res) => {
  connection.query('SELECT * FROM login_last', (error, rows) => {
    if(error) throw error;
    console.log('user info is : ', rows);
    
    res.status(200).send(rows)
    
  });
});

router.post('/getUserId', (req, res)=>{
  const uid = req.body.UID

  connection.query('select id from login_last where UID=?',[uid], (err,rows)=>{
    if(err) throw err
    console.log('user info is : ', rows)
    res.status(200).send(rows)
  })
})

router.post('/login', (req, res)=>{
  const body = req.body;
  const id = body.id;
  const pw = body.pw;
  console.log(id, pw);

  connection.query('SELECT * FROM login_last WHERE id=? AND password=?', [id, pw], (err, data)=>{
    console.log(data);
    if(data.length == 0){ // 로그인 실패
      console.log('로그인 실패');
      res.status(200).json(
        {
          "UID" : -1
        }
      )
    }
    else{
      // 로그인 성공
      console.log('로그인 성공');
      connection.query('select UID from login_last where id=?',[id],(err,data)=>{
        res.status(200).send(data[0]); 
      });
      
    }
  });

});


router.post('/register', (req, res) =>{
  const body = req.body;
  const id = body.id;
  const pw = body.pw;
  const name = body.name;

  connection.query('select * from login_last where id=?',[id],(err,data)=>{
    if(data.length == 0){
        console.log('회원가입 성공');
        connection.query('insert into login_last(id, password, name) values(?,?, ?)',[id,pw, name]);
        res.status(200).json(
          {
            "message" : true
          }
        );
    }else{
        console.log('회원가입 실패');
        res.status(200).json(
          {
            "message" : false
          }
        );
        
    }
    
  });
});

module.exports = router;