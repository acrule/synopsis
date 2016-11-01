var express = require('express');
var exphbs  = require('express-handlebars');

var index = require('./routes/index');
var note = require('./routes/note')

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use('/', index);
app.use(express.static('public'));

app.get('/note/:id', note.noteInfo);

app.listen(3000, function () {
  console.log('Biopsy listening on port 3000.');
});

module.exports = app;
