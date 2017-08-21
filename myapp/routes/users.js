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

router.delete('/:_id', function(req, res, next){
    var index = req.params._id;
    console.log(index);
    modelTask.remove({_id: index}, function (err) {
        if (err){
            return res.status(500).send(err);
        }
        res.status(200).send(res.body)
    });
});

// router.put('/:_id', function(req, res, next) {
//     var check = req.body.state;
//     var query = req.params._id;
//     modelTask.update(query, {$set: {state: true}}, function (err, result) {
//         if (err) {
//             res.send({'error': 'An error has occurred'});
//         }
//
//             res.status(200).send('result: ', result);
//
//     });
// });
router.put('/:_id', function (req, res) {
    let query = {_id: req.params._id}
    modelPost.update(query, {$set: {state: true}}, function (err, num) {
        if (err) {
            return res.status(500).send('Error!')
        }
        res.status(200).send('checked', num)
    })
})
module.exports = router;
