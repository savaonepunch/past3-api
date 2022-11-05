const { json } = require("body-parser");
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Webhook, MessageBuilder } = require("discord-webhook-node");

const Paste = require("../models/Paste");
const User = require("../models/User");

const hook = new Webhook(process.env.DISCORD_WEBHOOK);

// Get all pastes
// router.get('/', async (req, res) => {
//     try {
//         const pastes = await Paste.find({});
//         res.json(pastes);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// Get a paste
router.get("/:id", async (req, res) => {
    try {
        const paste = await Paste.find({
            _id: req.params.id,
        });
        if (!paste.length) {
            return res.status(404).json({ message: "Could not find paste" });
        } else {
            res.json(paste[0]);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a paste
router.post("/", async (req, res) => {
    const token = req.header("auth-token");
    let user;
    if (token) {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verified) return res.status(400).json({ message: "Invalid Token" });
        console.log(verified);
        user = await User.findOne({
            _id: verified.userId
        })

        if (!user) return res.status(400).json({ message: "Invalid Token" });
    }

    const paste = new Paste({
        title: req.body.title,
        author: req.body.author,
        paste: req.body.paste,
        syntax: req.body.syntax,
        userId: token ? user._id : 'Guest'
    });

    try {
        const newPaste = await paste.save();
        const embed = new MessageBuilder()
            .setTitle(newPaste.title)
            .setAuthor(newPaste.author)
            .setURL(`https://past3.netlify.app/pastes/${newPaste._id}`)
            .setColor("#fff")
            .setDescription(newPaste.paste)
            .setTimestamp(newPaste.addedDate);
        hook
            .send(embed)
            .then(() => console.log("Sent webhook successfully!"))
            .catch((err) => console.log(err.message));
        res.status(201).json({ newPaste });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get user pastes 
router.get('/user/:id', async (req, res) => {

    // Verify token
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ message: "Access Denied." });



    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified);
        const user = await User.findOne({
            _id: verified.userId
        })

        if (!user) return res.status(400).json({ message: "Invalid Token" });

        // Check if user has the same user id as the requested user id
        // here we can check later if the user has admin perms
        console.log(user._id.toJSON());
        console.log(req.params.id);
        if (user._id.toJSON() !== req.params.id) return res.status(401).json({ message: "Auth token doesn't have access to requested resource." });

        const pastes = await Paste.find({
            userId: user._id,
        });

        if (!pastes.length) {
            return res.status(404).json({ message: "Could not find any pastes" });
        } else {
            res.json(pastes);
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

});

module.exports = router;
