const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const session = require('express-session');

app.set('view engine', 'ejs')
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({secret:'naTestRunBeThisBoss'}));


mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Open For Mongo");
}).catch((err) => {
    console.log(err);
})



app.get('/', (req, res) => {
    res.json('Hey there')
})

app.get('/register', (req, res) => {
    res.render('register')
})


app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hashPw = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hashPw
    });
    await user.save();
    req.session.user_id = user._id

    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
});


app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPw = await bcrypt.compare(password, user.password);
    if(validPw){
        req.session.user_id = user._id
        res.redirect('/secret');
    }
    else{
        res.redirect('/login');
    }
});

app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login')
    }
    res.send('This is my secret')
})


app.listen(3000, () => {
    console.log("Listening On port 3000!");
})