import express from 'express';
import userRoutes from './routes/users.route';
import noteRoutes from './routes/notes.route';
import mongoose from 'mongoose';

const dotenv = require('dotenv');

dotenv.config();

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/notes-app-db";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
    console.log("Mongoose running");
});

dbConnection.on("error", (err) => {
    console.log("Mongoose Error!!!", err);
})

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);


app.listen(PORT, () => {
    console.log("Server started at PORT : "+PORT);
});