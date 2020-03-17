const Movie = require('../models/movie');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// get request return obj with movieList array
exports.getMovieList = async (req, res) =>{
    const access_token = req.query.access_token;
    console.log( "movieList js getMovieList");
    //decoded the access_token
    //get the user's movieList
    let decodedToken;
    try{
        decodedToken = jwt.verify(access_token, 'secretmoviedatabase')
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated');
        error.statusCode - 401;
        throw error;
    }
    userId = decodedToken.userId;

    try{
        const user = await User.findById(userId).populate('movieList');
        const movieList = user.movieList;
        
        res.status(200).json({
            movies: movieList,
            message: "Fetch all the movie successfully"
        });
    }catch(err){
        console.log(err);
    }
}

exports.postAddMovie = (req, res) =>{
    const access_token = req.query.access_token;
    console.log("movieList js postAddMovie");
    let decodedToken;
    try{
        decodedToken = jwt.verify(access_token, 'secretmoviedatabase')
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated from jwt');
        error.statusCode - 401;
        throw error;
    }
    const userId = decodedToken.userId;
    
    console.log("postAddMovie");
    const title = req.body.title;
    const year = req.body.year;
    const genre = req.body.genre;
    const rating = req.body.rating;
    const userRating = req.body.userRating;
    const image = req.body.image;

    //create a new movie object tobe store in movie database
    const movie = new Movie({
        title: title,
        year: year,
        genre: genre,
        rating: rating,
        userRating: userRating,
        image: image,
        creator: userId
    });

   //save the movie obj
    movie.save()
        .then(result =>{
            return User.findById(userId);
        })
        .then(user =>{
            user.movieList.push(movie);
            return user.save();
        })
        .then(result =>{
            //message: "Added the movie into the list",
            res.status(200).send(movie);
        })
        .catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            throw err;
        });
}

exports.getMovie = (req, res) =>{
    const access_token = req.query.access_token;
    console.log('movieList.js getMovie');
    let decodedToken;
    try{
        decodedToken = jwt.verify(access_token, 'secretmoviedatabase');

    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated from jwt');
        error.statusCode = 401;
        throw error;
    }
    const userId = decodedToken.userId;
    const movieId = req.params.id;

    //find the information of the particular movie
    Movie.findById(movieId)
        .then(fetchedMovie =>{
            if(!fetchedMovie){
                const error = new Error('could not find the movie to be updated');
                error.statusCode = 404;
                throw error;
            }
            
            if(fetchedMovie.creator._id.toString() !== userId){
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }
            // send the movie obj
            res.status(200).send(fetchedMovie);
        })
}


exports.deleteMovie = (req, res) =>{
    const access_token = req.query.access_token;

    console.log("movieList js deleteMovie");
    let decodedToken;
    try{
        decodedToken = jwt.verify(access_token, 'secretmoviedatabase')
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated');
        error.statusCode - 401;
        throw error;
    }
    const userId = decodedToken.userId;
    const movieId = req.params.id; //get the movie id

    Movie.findById(movieId)
        .then(fetchedMovie =>{
            if(!fetchedMovie){
                const error = new Error('could not find the movie to be updated');
                error.statusCode = 404;
                throw error;
            }
            if(fetchedMovie.creator._id.toString() !== userId){
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }
            //remove the movie from the movie database
            return Movie.findByIdAndRemove(movieId);
        })
        .then(result =>{
            //remove the movie from user movieList as well
            return User.findById(userId);
        })
        .then(user =>{
            user.movieList.pull(movieId);
            return user.save();
        })
        .then(result =>{
            res.status(200).json({
                message: "movie Deleted",
                deletion: res.deletedCount
            });
        });

}

exports.putReplaceMovie = (req, res) =>{
    const access_token = req.query.access_token;

    console.log("movieList js putReplaceMovie");
    let decodedToken;
    try{
        decodedToken = jwt.verify(access_token, 'secretmoviedatabase')
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated');
        error.statusCode - 401;
        throw error;
    }
    const userId = decodedToken.userId;
    //get the movie id
    const movieId = req.params.id;

    const title = req.body.title;
    const year = req.body.year;
    const genre = req.body.genre;
    const rating = req.body.rating;
    const userRating = req.body.userRating;
    const image = req.body.image;

  
    Movie.findById(movieId)
        .then(fetchedMovie =>{
            if(!fetchedMovie){
                const error = new Error('could not find the movie to be updated');
                error.statusCode = 404;
                throw error;
            }
            if(fetchedMovie.creator._id.toString() !== userId){
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }

            console.log(title, year, genre, rating, userRating,image)
            fetchedMovie.title = title;
            fetchedMovie.year = year;
            fetchedMovie.genre = genre;
            fetchedMovie.rating = rating;
            fetchedMovie.userRating = userRating;
            fetchedMovie.image = image;
            return fetchedMovie.save();
        })
        .then(result =>{
            res.status(200).send(result);
        })
        .catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
                throw Error;
            }
        });
}