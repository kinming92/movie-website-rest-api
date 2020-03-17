const MONGODB_URI =
  //`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00-fouup.mongodb.net:27017,cluster0-shard-00-01-fouup.mongodb.net:27017,cluster0-shard-00-02-fouup.mongodb.net:27017/${process.env.MONGO_DEFAULT_DATABASE}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`;
  `mongodb://kin:1234@cluster0-shard-00-00-fouup.mongodb.net:27017,cluster0-shard-00-01-fouup.mongodb.net:27017,cluster0-shard-00-02-fouup.mongodb.net:27017/movies?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const authControllers = require('./controllers/auth');
const movieListControllers = require('./controllers/movieList');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));  

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//signup
app.post('/Users', authControllers.postSignup);

//login 
app.post('/Users/login', authControllers.postLogin);

//logout
app.post('/Users/logout', authControllers.postLogout);

// retrieve all movies
app.get('/movies/movieList', movieListControllers.getMovieList);

app.post('/movies', movieListControllers.postAddMovie);

app.get('/movies/:id', movieListControllers.getMovie);

app.delete('/movies/:id', movieListControllers.deleteMovie);

app.put('/movies/:id/replace', movieListControllers.putReplaceMovie);



app.use((error, req, res, next) =>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

const port = process.env.PORT || 3000;

mongoose
    .connect(MONGODB_URI)
    .then( result =>{
        app.listen(port, () =>{
            console.log(`Listening on port ${port}`);
        }) ;
    }).catch(err => console.log(err));
