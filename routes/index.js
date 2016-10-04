var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      'title': 'Biopsy',
      'features':[
          {'text':'An amazing thing'
          },
          {'text':'Another amazing thing'
          },
          {'text':'Yet a third amazing thing'
          },
      ]
  });
});

module.exports = router;
