var express = require('express');
var exphbs  = require('express-handlebars');

var index = require('./routes/index');


var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use('/', index);

// app.get('/', function (req, res) {
//     res.render('index', {
//         title: "Biopsy"
//     });
// });

app.use('/public', express.static('public'));

app.listen(3000, function () {
  console.log('Biopsy listening on port 3000.');
});
