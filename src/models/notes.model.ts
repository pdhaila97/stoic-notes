import mongoose from 'mongoose';


const metaSchema = new mongoose.Schema({
    isCompleted: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    importance: {
        type: Number,
        enum: [1,2,3,4,5],
        default: 1
    }
}, {
    _id: false
})

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    meta: {
        type: metaSchema
    }
});

const Note = mongoose.model("Note", notesSchema);

export default Note;

