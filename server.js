const express = require('express');
const mongo = require('mongoose');
const _userAuth = require('./models/userAuth');
const _messages = require('./models/messages');
// const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const user = { username: null };

const app = express();

mongo.connect('mongodb://localhost/userAuth,messages', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "Tis a secret",
    resave: true,
    saveUninitialized: true
}));
// app.use(methodOverride('_method'));


app.get('/', async (req, res) => {
    let messages = await _messages.find().sort( {
        dateTime: 'desc' });
    res.render('index', { 
        // username: user.username,
        messages: messages,
        username: req.session.username
    });
});

app.get('/login', (req, res) => {
    res.render('login', { userAuth: new _userAuth() });
})

app.post('/login', async (req, res) => {
    try {
        let userAuth = await _userAuth.findOne({ username: req.body.username });
        if( userAuth.password == req.body.password) {
            // user.username = userAuth.username
            req.session.username = userAuth.username
            res.render('success', { message: `${userAuth.username} log-in was successful!` });
        } else {
            console.log('password is incorrect');
        };
    } catch (e) {
        console.log(e);
        res.render('create-account', { 
            userAuth: {
                username: req.body.username,
                password: req.body.password
            },
            message: "Username was not found, please create account"});
    };
});

app.post('/logout', (req, res) => {
    // if (user.username != null) {
    if (req.session.username != null) {
        // let currentUser = user.username;
        let currentUser = req.session.username;
        // user.username = null;
        req.session.username = null
        res.render('success', { message: `${currentUser} has been logged out` })
    }
})

app.get('/success', (req, res) => {
    res.render('success', { message: 'No attempts made' });
});

app.get('/create-account', (req, res) => {
    res.render('create-account', {
        message: '',
        username: '',
        password: ''
    });
});

app.post('/create-account', async (req, res) => {
    let userAuth = new _userAuth();
    userAuth.username = req.body.username
    userAuth.password = req.body.password
    try {
        userAuth = await userAuth.save();
        res.render('success', { message: `${userAuth.username} account creation was successful!` })
    } catch (e) {
        console.log(e)
        res.render('create-account', { userAuth: userAuth, message: 'Account creation failed????' })
    }
})

app.post('/post', async (req, res) => {
    let userMessage = new _messages();
    // userMessage.username = user.username;
    userMessage.username = req.session.username;
    userMessage.message = req.body.message;
    console.log(`Posted: ${req.body.message}`);
    try {
        userMessage = await userMessage.save();
        res.redirect('/');
    } catch (e) {
        console.log(e)
        res.redirect('/');
    };
    // res.redirect('/');
})

app.listen(8080);