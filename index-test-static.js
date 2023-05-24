var express = require('express');
var app = express();

// TEST that Express is pulling static files
app.use(express.static('public'));

app.listen(3000, function() {
  console.log('Running on port: 3000');
});