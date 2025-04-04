const {EventEmitter} = require('events');
const { readFile, readFileSync } = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")

const User = require("./model/User");

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost/27017");
app.set("view engine", "ejs");
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Geeks For Geeks Registration code
app.use(require("express-session")({
    secret: "Pathologic Polyhedron",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//end of geeks for geeks code


// fix for MIME type error when trying to invoke javascript files
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// fix for MIME type error when trying to invoke css files
app.use(express.static('public', {
  setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      }
  }
}));

//Routes:
app.get('/', (req, res) => {
    res.render("home");
  });

app.get('/login', (req, res) => {
    res.render("login")
  });

app.get('/register', (req, res) => {
    res.render("register")
  });

app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
}
  res.render('viewJournals', { userId: req.session.userId, username: req.session.username });
  });

app.get('/entries/:id', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
}
  const journalId = req.params.id;
  res.render("entriesList", { userId: req.session.userId, username: req.session.username, journalId: journalId })
  });

app.get('/newJournal', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
}
  res.render("createJournal", { userId: req.session.userId });
  });

app.get('/newEntry/:id',(req, res) => {
  const journalId = req.params.id;
  res.render("createEntry", { journalId: journalId, userId: req.session.userId });
  });

  app.get('/account',(req, res) => {
    res.render("account", { userId: req.session.userId, username: req.session.username});
    });

//end of routes


//User Registration System
app.post("/register", async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);

  const user = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: hash
  });

  return res.status(200) && res.redirect("/"); 
});

//User login
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await User.findOne({ email: req.body.email });
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect('/dashboard');
        return;
      } 
    } catch (error) {
      res.status(400).send({ error });
    }
});

app.delete("/account", async function(req, res){
  console.log('app.delete reached');

  //take the id of the user currently logged in
  //will always have value as is only accessible to users who are logged in
  const id = req.session.userId;
  console.log(id);

  //find user by id and delete their record from Mongo
  //or give error message
  try {
    await User.findByIdAndDelete(id); 
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error });
  }
});

app.put('/account', async (req, res) => {
  console.log('/update-password reached');
  const { userId, newPassword } = req.body;
  console.log('req.body', req.body);
  console.log('body:', userId, newPassword);

  try {
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('user found----------------------------------------------------');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
    console.log('/update-password reached')
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log('/update-password reached')
  }
});


//Handling user logout 
app.get("/logout", function (req, res) {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });