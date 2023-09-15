const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const session = require('express-session');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('public'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
// routes
const routes = require('./routes/routes');

const userController = require('./controllers/controller');
// const errorController = require('./controllers/error.js');

app.use('/', routes);
app.use(express.json());
// app.use(errorController.get404);


//db
const User = require('./models/user');
const Event = require('./models/event');
const Guestbook = require('./models/guestbook');

 sequelize.sync().then(() => {
// sequelize.sync({ force: true }).then(() => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}).catch(error => console.log(error));