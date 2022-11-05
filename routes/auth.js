const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { registerValidation, loginValidation } = require('../validation');

const User = require("../models/User");

router.get("/", (req, res) => {
    res.json({ message: "Auth route" });
});

router.post("/register", async (req, res) => {
    // Validating data before creating user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if user is already in the database
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ message: `A user with the email ${emailExists.email} already exists.` })

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.status(201).json({ user: savedUser._id });
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/login', async (req, res) => {
    // Validate input data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if user with email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: `Email ${req.body.email} doesn't exist.` });

    // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: `Invalid password.` });

    // Create and assign a token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET)
    res.json({ token });
});

module.exports = router;
