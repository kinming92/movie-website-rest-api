# Summary 
This project serves as the backend to handle HTTP request and response for the movie collection webiste.

# Movie Database Endpoint Documentation
| Url | Endpoint Description | HTTP method | Expected Body Request | Expected Response |
|-----|----------------------|-------------|-----------------------|-------------------|
| /Users | New User Signup | POST | x-www-form-urlencoded | A JSON object contains: registered username email userId |
| /Users/login | User login | POST | x-www-form-urlencoded | A JSON object contains: id (session id, which is access_token ) ttl (time to live) created userId |
| /Users/logout | User logout |POST | none | none |


| Url | Endpoint Description | HTTP method | Expected Body Request | Expected Response |
|-----|----------------------|-------------|-----------------------|-------------------|
| /movies/movieList?access_token= | retrieve all the movieList | GET | none | A JSON object contains all movies information |
| /movies?access_token= | create a new movie | POST | x-www-form-urlencoded | A JSON object contains the new movie information |
| /movies/__{id}__?access_token= | retrieve a single movie by movieId | GET | none | A JSON object contains the information about movie |
| /movies/__{id}__?access_token= | delete a movie by movieId | DELETE | none | A delete message object |
| /movies/__{id}__/replace?access_token= | edit a movie by movieId | PUT | x-www-form-urlencoded A JSON object contains the updated movie information |

## Parameter

| Path parameter | Description |
|----------------|-------------|
| {id} | movieId |

| Query parameter | Description | Type |
|-----------------|-------------|------|
| access_token | for user authentication | String |

## Request and Response Usage Example

### Request
```
POST http://localhost:3000/Users?username=sample&email=sample@mail.com&password=sample
Body
x-www-form-urlencoded
"username": "string"
"email": "string"
"password": "string"
```
### Response
```
{"registered_username":"sample","email":"sample@mail.com","userId":"sample"}
```

### Request
```
POST http://localhost:3000/Users/login?username=sample&password=sample

Body
x-www-form-urlencoded
"username": "string"
"password": "string"
```
### Response

```
"id": "sample",
    "ttl": 3600000,
    "created": "2020-03-10T00:44:11.018Z",
    "userId": "sample"
```
### Request
```
POST http://localhost:3000/Users/logout?access_token=sampleToken
```


### Request
```
GET http://localhost:3000/movies/movieList?access_token=sampleToken
```
### Response
```
{"movies":[{"_id":"movieId","title":"superman","year":2019,"genre":"action","rating":"G","userRating":5,"image":"imageUrl","creator":"sampleUserId","__v":0}],"message":"Fetch all the movie successfully"}
```

### Request
```
POST http://localhost:3000/movies?access_token=sampleToken
Body
x-www-form-urlencoded
"title": "string",
"year": number,
"genre": "string",
"rating": "string",
"userRating": number,
"image": "string", 
```
### Response
```
{"_id":"movieId","title":"test","year":2011,"genre":"Action","rating":"G","userRating":1,"image":"test-url","creator":"userId","__v":0}
```



### Request
```
GET http://localhost:3000/movies/movieId?access_token=sampleToken
```

### Respond
```
{"_id":"movieId","title":"sample","year":2019,"genre":"romance","rating":"R","userRating":5,"image":"sampleUrl","creator":"userId","__v":0}
```
### Request
```
DELETE http://localhost:3000/movies/movieId?access_token=sampleToken
```
### Respond
```
{"message":"movie Deleted"}
```

### Request
```
PUT http://localhost:3000/movies/{id}/replace?access_token=sampleToken
Body
x-www-form-urlencoded
"title": "string",
"year": number,
"genre": "string",
"rating": "string",
"userRating": number,
"image": "string",

```
### Response
```
{"_id":"movieId","title":"superman","year":2019,"genre":"Magical realism","rating":"G","userRating":4,"image":"imageUrl","creator":"userId","__v":0}
```
