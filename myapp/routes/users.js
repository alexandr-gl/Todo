var express = require('express');
var modelTask = require('./model');
var router = express.Router();

//GET users listing.
router.get('/', function(req, res, next) {
    console.log("Sucsess");
    return modelTask.find(function (err, articles) {
        if (!err) {
            return res.send(newtask);
        }
    });
    // var taski = db.getCollection('newtasks').find();
    // console.log(taski);
});

router.post('/', function(req, res, next) {
    var newTask = new modelTask({
        id: req.body.id,
        text: req.body.text,
        state: req.body.state
    });

    newTask.save(function (err) {
       if(!err) {console.log('Success');}
    });
});
module.exports = router;
