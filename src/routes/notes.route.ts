import express, { Request } from 'express';
import Note from '../models/notes.model';
import auth from '../middlewares/auth.middleware';



const router = express.Router();

// Create a note
router.post("/", auth, async (req: any, res: any) => {
    try {

        const note: any = new Note(req.body);
        note.owner = req.user._id;
        await note.save();
        res.send(note);

    } catch (err) {

        res.status(500).send(err);

    }
});

// Get all notes
router.get("/", auth, async (req: any, res: any) => {
    try {

        const notes = await Note.find({owner: req.user._id});
        if(notes && notes.length > 0) {
            return res.send(notes);
        }

        res.send(404).send();

    } catch (err) {

        res.status(500).send(err);

    }
});

// Get note by ID
router.get("/:id", auth, async (req: any, res: any) => {
    try {
        
        const _id = req.params.id;
        const note = await Note.findOne({_id, owner: req.user._id});
        if(note) {
            return res.send(note);
        }

        res.status(404).send();

    } catch (err) {
        
        res.status(500).send(err);

    }
});

// Update note by ID
router.patch("/:id", auth, async (req: any, res: any) => {

    try {
        
        const _id = req.params.id;
        let note: any = await Note.findOne({_id, owner: req.user._id});
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
router.delete("/:id", auth, async (req:any, res: any) => {

    try {
        
        const _id = req.params.id;
        const note = Note.findOne({_id, owner: req.user._id});
        if(!note) {
            return res.status(404).send();
        }
        
        res.send(note);

    } catch (err) {
        
        res.status(500).send(err);

    }

});

export default router;