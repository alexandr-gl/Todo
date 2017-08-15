let express = require('express');
let mongoose = require('mongoose');

let taskSchema = new mongoose.Schema( {
    id: Number,
    text: String,
    state: Boolean
} );
let modelTask = mongoose.model('newTask', taskSchema);
module.exports = modelTask;