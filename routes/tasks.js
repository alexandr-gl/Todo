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
                return res.send({error: 'Task not deleted'});
            }
            res.status(200).send();
        });
});

router.delete('/', function(req, res, next){
    modelTask.remove({state: true}, function(err){
        if (err){
            return res.send({error: 'Tasks not deleted'});;
        }
        res.status(200).send(res.body);
    });
});

router.put('/put', function (req, res) {
    console.log('>>> ALL TASKS STATE <<<<', req.body);
    req.body.state = JSON.parse(req.body.state);
    modelTask.update({state: !req.body.state}, {$set: {state: req.body.state}}, {multi:true}, function (err, num) {
            if (err) {
                return res.send({error: 'Tasks not updated'});
            }
            res.status(200);
        });
});

router.put('/:id', function (req, res) {
    console.log('>>>> CHANGE STATE ON SERVER <<<<', req.body);
    modelTask.update({_id: req.params.id}, {$set: {state: req.body.state, text: req.body.text}}, function (err, num) {
            if (err) {
                return res.send({error: 'Task not update'});
            }
            res.status(200);
        });
});

module.exports = router;
