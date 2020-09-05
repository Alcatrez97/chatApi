var express = require('express');
var testRouter = express.Router();
const message = require('../models/message')

testRouter.route('/sendmsg')
    .post((req, res)=>{
        message.create(req.body)
            .then(()=> console.log('msg created succesfully'));
            res.end('done');
    });

module.exports = testRouter;
