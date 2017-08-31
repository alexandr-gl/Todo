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

router.delete('/delOne/:id', function(req, res, next){
    var index = req.params.id;
        modelTask.remove({_id: index}, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(res.body)
        });
});

router.delete('/checked/', function(req, res, next){
    modelTask.remove({state: true}, function(err){
        if (err){
            return res.status(500).send(err);
        }
        res.status(200).send(res.body);
    });
});

router.put('/:_id', function (req, res) {
    var query = {_id: req.params._id};
        modelTask.update(query, {$set: {state: req.body.state}}, function (err, num) {
            if (err) {
                return res.status(500).send('Error!')
            }
            res.status(200).send('checked', num)
        })
});

router.put('/', function (req, res) {
    var query = req.body.state;
    if(query == "true")
    {
        modelTask.update({state: false}, {$set: {state: true}}, {multi:true}, function (err, num) {
            if (err) {
                return res.status(500).send('Error!')
            }
            res.status(200).send('checked', num)
        });
    }
    else if(query == "false")
    {
        modelTask.update({state: true}, {$set: {state: false}}, {multi:true}, function (err, num) {
            if (err) {
                return res.status(500).send('Error!')
            }
            res.status(200).send('checked', num)
        });
    }
});

router.put('/edit/:_id', function (req, res) {
    var query = {_id: req.params._id};
    modelTask.update(query, {$set: {text: req.body.text}}, function (err, num) {
        if (err) {
            return res.status(500).send('Error!')
        }
        res.status(200).send('checked', num)
    })
});


module.exports = router;
