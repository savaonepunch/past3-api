const express = require('express');
const router = express.Router();

const User = require("../models/User");

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Could not find user" });
        } else {
            res.json(user.name);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;