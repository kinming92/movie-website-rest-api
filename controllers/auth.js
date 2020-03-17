const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req, res) =>{
     //expected response
    //A JSON object contains:
    // registered username
    // email
    // userId
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    //encryt the user password 
    //create a user object in mongodb
    //save the the user
    //then return the json file
    bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
        console.log(result);
        return res.status(200).send(JSON.stringify({
            registered_username : result.username,
            email: result.email,
            userId: result._id
        }));
    })
    .catch(err => console.log(err));
}

exports.postLogin = (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    let loginUser;

    User.findOne({username: username})
        .then(user =>{
            if(!user){
                const error = new Error('Username cannot be found');
                error.statusCode = 401;
                throw error;      
            }
            loginUser = user;
            return bcrypt.compare(password, loginUser.password);
        })
        .then( passwordIsEqual =>{
            if(!passwordIsEqual){
                const error = new Error("Wrong password");
                error.statusCode = 401; //bad request
                throw error;
            }
            const token = jwt.sign({
                username: loginUser.username,
                userId: loginUser._id.toString()
            }, 'secretmoviedatabase', {expiresIn: '1hr'});

            res.status(200).json({
                id: token,
                ttl: 3600000,
                created: new Date().toISOString(),
                userId: loginUser._id.toString()
            });
        })
}

exports.postLogout = (req, res ) =>{
    console.log(req.query.access_token, "logout");
    res.status(204).json();
    
}