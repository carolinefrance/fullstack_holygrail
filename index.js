/* Back-end server, root level index.js */
/*____________________________________________ DEPENDENCIES */ 
/*........................... express for the web framework */
var express = require('express');
/*.......................... create an Express app instance */
var app     = express();
/*............................ redis for the Redis database */
var redis   = require("redis"); 
/* create a Redis client instance to connect to Redis server */
var client = redis.createClient(); // deleted port number ({ port: 6378 });

// Configure the Express app to serve static files from the public directory. This allows files like HTML, CSS, and JavaScript files to be served to clients when requested.
app.use(express.static('public'));

// Use Redis client to set and get initial values for multiple key-value pairs
client.mset('header',0,'left',0,'article',0,'right',0,'footer',0);
client.mget(['header','left','article','right','footer'], 
  function(err, value) {
    console.log(value);
});   

// Define data() function that returns a promise. Within the promise, it uses the Redis client to get values of keys 'header', 'left', 'article', 'right', and 'footer' using "mget". Retrieved values are transformed into an object data with properties corresponding to the keys. The promise is resolved with the data object if there are no errors, or rejected with null otherwise.
function data(){
    return new Promise((resolve, reject) => {
        client.mget(['header','left','article','right','footer'], 
            function(err, value) {
                const data = {
                    'header':  Number(value[0]),
                    'left':    Number(value[1]),
                    'article': Number(value[2]),
                    'right':   Number(value[3]),
                    'footer':  Number(value[4])
                };
                err ? reject(null) : resolve(data);
            }
        );
    });    
}

/* Route for GET request to '/data'
When endpoint is accessed, the data() function is called to retrieve data from Redis. Retrieved data is then sent as the response using res.send(data). */
app.get('/data', function (req, res) {
    data()            
        .then(data => {
            console.log(data);
            res.send(data);                
        });
});

/* Route for GET request to '/update/:key/:value' 
- gets key-value parameters from URL w/ "req.params.key" & "req.params.value"
- gets current value of key w/ "client.get" 
- calculates new value = retrieved value + specified value 
- updates value of key in Redis w/ "client.set"
- gets updated data from Redis w/ data() function, logs it to the console, and sends it as the response */
app.get('/update/:key/:value', function (req, res) {
    const key = req.params.key;
    let value = Number(req.params.value);
    client.get(key, function(err, reply) {
        // new value
        value = Number(reply) + value;
        client.set(key, value);
        // return data to client
        data()            
            .then(data => {
                console.log(data);
                res.send(data);                
            });
    });   
});

/* Start Express server and listen on port 3000. */
app.listen(3000, () => {
  console.log('Running on 3000');
});

/* Event listener closes Redis client connection when the process exits */
process.on("exit", function(){
    client.quit();
});