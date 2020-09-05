const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Users = require('../models/users')
const passport = require('passport')

const userRouter = express.Router();
userRouter.use(bodyparser.json());


//get all users
userRouter.options('*', (req,res) => {
    res.sendStatus(200);  
})
userRouter.get('/', authenticate.verifyUser, (req, res, next) => {
    Users.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
});

userRouter.get('/signup', (req, res) => {
    res.end('cannot GET singUp');
});


//user signup
userRouter.post('/signup', (req, res) => {
    Users.register(new Users( {user_name: req.body.username}),
    req.body.password,
    (err, user) =>{
        if(err){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'aplication/json');
            res.json({err: err});
        }
        else{
            if(req.body.firstname) user.firstname = req.body.firstname;
            if(req.body.lastname) user.lastname = req.body.lastname;
            user.save((err, user) => {
                if(err){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'User registration succesful!'});
                }
            });
        }
    });
});

//user login
userRouter.post('/login', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, status: 'Login Unsuccessful!', err: info });
        }
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user' });
            }
        })
        const token = authenticate.getToken({ _id: req.user.id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You are successfully login!' });
    })(req, res, next);

});

//user logout
userRouter.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        const err = new Error('You are not loggin');
        err.status = 403;
        next(err);
    }
});

//facebook authentication 
userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        var token = authenticate.getToken({ _id: req.user._id });
        console.log(req.user._id + ' <<  logged user id');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You are logged in !!' });

    }
});

//jwt authentication
userRouter.get('/checkJWTToken',  (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            res.statusCode = 401;
            res.setHeader = ('Content- Type', 'appllication/json');
            return res.json({ status: 'JWT invalid', success: false, err: info })
        }
        else {
            res.statusCode = 200;
            res.setHeader = ('Content- Type', 'appllication/json');
            return res.json({ status: 'JWT valid', success: falstrue, user: user })
        }
    })(req, res);
});


module.exports = userRouter;
