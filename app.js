const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv').config();

const app = express();
// require('./server/config/passport')(passport);

const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/notion-oauth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/js', express.static(path.join(__dirname, './client/static/js')));
app.use(express.static(path.join(__dirname, './client/static')));
app.set('views', path.join(__dirname, './client/views'));

app.set('view engine', 'ejs');

// Passport middleware
app.use(bodyParser.urlencoded({extended: true}));
// app.use(
//     session({
//         secret: 'noogle automation',
//         resave: false,
//         saveUninitialized: false,
//         store: new MongoStore({mongooseConnection: mongoose.connection}),
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(bodyParser.json());

app.use(require('./server/routes/index'));
app.use('/auth', require('./server/routes/auth'));

(async function () {
    try {
        await app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
