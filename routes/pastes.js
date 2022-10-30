const { json } = require('body-parser');
const express = require('express');
const router = express.Router();

const Paste = require('../models/Paste');

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
router.get('/:id', async (req, res) => {
    try {
        const paste = await Paste.find({
            "_id": req.params.id
        });
        if (!paste.length) {
            return res.status(404).json({ message: "Could not find movie suggestion" });
        } else {
            res.json(paste[0]);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a paste
router.post('/', async (req, res) => {
    const paste = new Paste({
        title: req.body.title,
        author: req.body.author,
        paste: req.body.paste,
        syntax: req.body.syntax,
    })

    try {
        const newPaste = await paste.save();
        res.status(201).json({ newPaste });
    } catch (error) {
        res.status(400).json({ error });
    }
})

module.exports = router;