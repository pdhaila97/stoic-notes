import express from 'express';
import User from '../models/users.model'

const router = express.Router();


//Create User
router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.getAuthToken();
        res.send({user, token});
    } catch (err) {
        res.status(500).send({err});
    }
    // res.send("Use the one and only user : author1")
});


//Get User info
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if(!user) {
            res.status(404).send({error: "User not found", user: null});
        }

        const token = await user.getAuthToken();

        res.send({user, token});

    } catch (err) {
        res.status(500).send(err);
    }
});



export default router;