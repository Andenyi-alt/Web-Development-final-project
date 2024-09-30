const express = require ('express')
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const { check, validationResult } = require('express-validator')

//Initialise the app
const app = express();

//Session middleware
app.use(session({
    secret:'24bthk3',
    resave:false,
    saveUninitialized: false
}));

//create connection to db server
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'belleame',
    database:'finalproject'
});

//connect
connection.connect((err) => {
    if(err){
        console.error('Error connecting to mysql:' + err.stack);
        return;
    }
    console.log('connected successsfully ');
});

//serve static files
app.use(express.static(__dirname));

//middleware for handling incoming data
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.urlencoded({extended : true}));

//define routes
app.get('/signup', (request,response) => {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

//create a user object

const User = {
    tableName: 'users',
    createUser: function(newUser, callback){
        connection.query('INSERT INTO' + this.tableName + 'SET ?',newUser , callback);
    },
    getUserByEmail: function(email,callback){
        connection.query('SELECT * FROM' + this.tableName + 'WHERE email = ?', email,callback );
    },
    getUserByUsername: function(username,callback){
        connection.query('SELECT * FROM' + this.tableName + 'WHERE username = ?', username, callback);
    }

};

//registrationh handling
app.post('api/user/signup', [
    //basic valid
    check('email').isEmail().withMessage('please provide a valid email adress'),
    check('username').isAlphanumeric().withMessage('username is alphanumeric'),
    
    //check for uniqueness of user
    check('email').custom( async (value) => {
        const user = await User.getUserByEmail(value);
        if(User){
            throw new Error('Email already exists!');

        }
    }),
    check('username').custom(async (value) => {
        const user = await User.getUserByUsername(value);
        if(user){
            throw new Error('username already exists!');
        }
    })

], async(req,res) => {
    //check for any validation errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    //hash password
    const saltRounds= 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    //create new user object
    const newUser = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: hashedPassword
        
    };

    //save our new user
    User.createUser(newUser, (error, results , fields) => {
        if(error){
            console.error('Error inserting new user record:' + error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log('New user successfully created.');
        res.status(201).json(newUser);
    })
});

//loginroute
const loginUser = async (username, password) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }
    })
};


  
app.listen(4000, () => {
    console.log('server is running on port 4000')
})