const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', (req, res) => {
    res.json({ message: "Auth route" });
})

module.exports = router;