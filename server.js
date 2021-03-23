const express = require('express');
const mongo = require('mongoose');
const userAuth = require('./models/userAuth');
const _userAuth = require('./models/userAuth');
const user = { username: null };

const app = express();

mongo.connect('mongodb://localhost/userAuth', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('index', { username: user.username });
});

app.get('/login', (req, res) => {
    res.render('login', { userAuth: new _userAuth() });
})

app.post('/login', async (req, res) => {
    try {
        let userAuth = await _userAuth.findOne({ username: req.body.username });
        if( userAuth.password == req.body.password) {
            user.username = userAuth.username
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
    if (user.username != null) {
        let currentUser = user.username;
        user.username = null;
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

app.listen(8080);