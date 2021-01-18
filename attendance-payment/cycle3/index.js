const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const express = require('express');
const layout = require('express-layout');
const bodyParser = require('body-parser');

const path = require('path');
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

const middlewares = [
  layout(),
  express.static(path.join(__dirname, "public")),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json()
];
app.use(middlewares);

const {check,validationResult,matchedData} = require("express-validator");

app.get('/', (req,res) => {
  res.render('contact',{
    input:false,
    output:false,
    flag:0,
    errors:false,
  });
});

app.post('/',[
  check("matric")
    .isLength({min:1})
    .withMessage("Matric number is required")
    .trim(),
  check("key")
    .isLength({min:1})
    .withMessage("Key is required")
    .trim()
  ],
  async (req,res) => {
    try {
      const errors = validationResult(req);
      const matric_no = req.body.matric.trim().toUpperCase();
      const sqlq = "SELECT * FROM payment_base WHERE matric = $1";
      const client = await pool.connect();
      const result = await client.query(sqlq,[matric_no]);
      const results = {'results': (result) ? result.rows : null};

      const searchKey = await client.query('SELECT key FROM key_table');
      const keys = {'keys': (searchKey) ? searchKey.rows : null};
      const theKey = (JSON.stringify(keys.keys[0].key)).replace(/\"/g, "");

      if (req.body.key.trim().toUpperCase() === theKey.toUpperCase()){
        output = results.results[0];
        if (output){
          res.render('contact',{
            input:matchedData(req),
            output:output,
            flag:0,
            errors:errors.mapped()
          });
        } else {
          res.render('contact',{
            input:matchedData(req),
            output:false,
            flag:1,
            errors:errors.mapped()
          });
        }
      }
      else {
          res.render('contact',{
            input:matchedData(req),
            output:false,
            flag:2,
            errors:errors.mapped()
          });
      }
      //console.log(JSON.stringify(output));
      client.release();
    } catch (err) {
      console.error(err);
      res.send(err);
    }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))