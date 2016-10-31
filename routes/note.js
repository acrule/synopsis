var notes = require('../public/note.json');

exports.noteInfo = function(req, res) { 
	var noteID = req.params.id;
	noteID = parseInt(noteID);

  	var note = notes.notes[noteID-1]; // off by one, our first project has index 0

    notes.notes[noteID-1].reads++ // increiment num of reads

  	res.json(note);
}
