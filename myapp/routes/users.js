var express = require('express');
let modelTask = require('./model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(err){
    res.status(500).send(err);
  }
  res.status(200).send('respond with a resource', req.data);
});

module.exports = router;
