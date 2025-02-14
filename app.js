const {EventEmitter} = require('events');
const { readFile, readFileSync } = require('fs');
const path = require('path');
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

//const User = require('./model/User');

// fix for MIME type error when trying to invoke javascript files
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
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

app.get('/entries', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
}
  res.render("entriesList", { userId: req.session.userId })
  });

app.get('/entry', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
}
  res.render("viewEntry")
  });

app.get('/newJournal', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
}
  res.render("createJournal", { userId: req.session.userId });
  });

app.get('/newEntry',(req, res) => {
  res.render("createEntry", { userId: req.session.userId });
  });

//end of routes


//User Registration System
app.post("/register", async (req, res) => {
  const user = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  return res.status(200) && res.redirect("/"); 
});

//User login
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          req.session.userId = user._id;
          req.session.username = user.username;
          res.redirect('/dashboard');
          return;
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});


//Handling user logout 
app.get("/logout", function (req, res) {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

/* old register system
app.post('/register', async(request, response) =>{
    let CIU = "https://prod-04.ukwest.logic.azure.com/workflows/f0c9f6d8978f401bb66b505320f0405b/triggers/When_a_HTTP_request_is_received/paths/invoke/register?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=x64fYlaLHPsJ5ovDODDeknsf--aJLEMOFLYwACzO5C0";

    const bcrypt = require('bcrypt');
    const { email, username, password } = request.body;
    submitData = new FormData();
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4(); 

    submitData.append('userID', userId);
    submitData.append('email', email);
    submitData.append('username', username);
    submitData.append('passwordHash',hashedPassword);

    $.ajax({
        url: CIU,
        data: submitData,
        cache: false,
        enctype: 'multipart/form-data',
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
         
        }
      });


    res.json({ message: 'User registered successfully', userId, username, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
})
*/
  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });