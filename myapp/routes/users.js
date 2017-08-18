var express = require('express');
var modelTask = require('../models/model');
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

router.delete('/', function(req, res, next){
    var index = req.params._id;
    modelTask.remove({_id: index}, function (err) {
        if (err){
            return res.status(500).send(err);
        }
        res.status(200).send(res.body)
    })
    //db.getCollection('newtasks').remove({id: 3});
});
module.exports = router;
