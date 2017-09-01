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

router.post('/', function(req, res) {
    modelTask.create(req.body, function (err, result) {
        if(err || !result){
            return res.send({error: 'Tasks not uploaded'});
        }
        res.send(result);
    });
});

router.delete('/:id', function(req, res, next){
        modelTask.remove({_id: req.params.id}, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send();
        });
});

router.delete('/', function(req, res, next){
    modelTask.remove({state: true}, function(err){
        if (err){
            return res.status(500).send(err);
        }
        res.status(200).send(res.body);
    });
});

router.put('/checkAll', function (req, res) {
    req.body.state = JSON.parse(req.body.state);
    modelTask.update({state: !req.body.state}, {$set: {state: req.body.state}}, {multi:true}, function (err, num) {
            if (err) {
                return res.status(500).send('Error!')
            }
            res.status(200).send('checked', num)
        });
});

router.put('/:id', function (req, res) {
    modelTask.update({_id: req.params.id}, {$set: {state: req.body.state, text: req.body.text}}, function (err, num) {
            if (err) {
                return res.status(500).send('Error!')
            }
            res.status(200).send('checked', num)
        })
});

module.exports = router;
