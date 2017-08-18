var express = require('express');
var modelTask = require('./model');
var router = express.Router();

//GET users listing.
router.get('/', function(req, res, next) {
    return modelTask.find(function (err, result) {
        if (err || !result) {
            return res.send({error: 'Tasks wasnt got'});
        }

        res.send(result);
    });
});

router.post('/', function(req, res, next) {
    var post = req.body;
    modelTask.create(post, function (err, result) {
        if(err || !result){
            return res.send({error: 'Tasks not uploaded'});
        }
        res.send(result);
    });
});
module.exports = router;
