import express from 'express';
import Note from '../models/notes.model';



const router = express.Router();

// Create a note
router.post("/", async (req, res) => {
    try {

        const note = new Note(req.body);
        await note.save();
        res.send(note);

    } catch (err) {

        res.status(500).send(err);

    }
});

// Get all notes
router.get("/", async (req, res) => {
    try {

        const notes = await Note.find({});
        if(notes) {
            return res.send(notes);
        }

        res.send(404).send();

    } catch (err) {

        res.status(500).send(err);

    }
});

// Get note by ID
router.get("/:id", async (req, res) => {
    try {
        
        const _id = req.params.id;
        const note = await Note.findById(_id);
        if(note) {
            return res.send(note);
        }

        res.status(404).send();

    } catch (err) {
        
        res.status(500).send(err);

    }
});

// Update note by ID
router.patch("/:id", async (req, res) => {

    try {
        
        const _id = req.params.id;
        let note: any = await Note.findById(_id);
        const updates = Object.keys(req.body);

        updates.forEach(update => {
            if(!(req.body[update] instanceof Object)) {
                note[update] = req.body[update];
            } else {
                Object.keys(req.body[update]).forEach( metaUpdate => {
                    note[update][metaUpdate] = req.body[update][metaUpdate];
                })
            }
        });

        note = await note.save();
        if(!note) {
            return res.status(404).send();
        }
        
        res.send(note);

    } catch (err) {
        
        res.status(500).send(err);

    }

});

// Delete Note by ID
router.delete("/:id", async (req, res) => {

    try {
        
        const _id = req.params.id;
        const note = Note.findByIdAndDelete(_id);
        if(!note) {
            return res.status(404).send();
        }
        
        res.send(note);

    } catch (err) {
        
        res.status(500).send(err);

    }

});

export default router;