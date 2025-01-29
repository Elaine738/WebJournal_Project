const {EventEmitter} = require('events');
const { readFile, readFileSync } = require('fs');
const express = require('express');
const path = require('path');


const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  });

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
  });

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'viewJournals.html'));
  });

app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'entriesList.html'));
  });

app.get('/entry', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'viewEntry.html'));
  });

app.get('/newJournal', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'createJournal.html'));
  });

app.get('/newEntry', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'createEntry.html'));
  });



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
  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });