import express from 'express';
import User from '../models/users.model'
import auth from '../middlewares/auth.middleware';

const router = express.Router();


//Create User
router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.getAuthToken();
        res.status(201).send({user, token});
    } catch (err) {
        res.status(500).send({err});
    }
    // res.send("Use the one and only user : author1")
});


// Login User
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


// Logout User
router.post("/logout", auth, async (req: any, res: any) => {
    try {
        const user = req.user;
        if(!user) {
            return res.status(404).send();
        }
        const logoutAll = req.query.all !== undefined;
        user.tokens = logoutAll ? [] : user.tokens.filter((token: any) => {
            return token.token !== req.token;
        });

        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }

});



export default router;