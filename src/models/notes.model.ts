import mongoose, { SchemaType, Schema, SchemaTypes } from 'mongoose';
import User from './users.model';


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
        type: metaSchema,
        default: {
            isCompleted: false,
            isArchived: false,
            importance: 1
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }
}, {timestamps: true});

notesSchema.methods.toJSON = function() {
    const note = this.toObject();
    delete note.owner;
    return note;
}

const Note = mongoose.model("Note", notesSchema);

export default Note;

