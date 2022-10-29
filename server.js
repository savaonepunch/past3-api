require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = 443;

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connections[0];
// const authDb = mongoose.connections[1];

db.on('error', (err) => console.error(err));
db.on('open', () => {
    console.log('Connected to database');

    const app = express();

    app.use(cors(corsOptions))
    app.use(express.json());

    const pastesRoute = require('./routes/pastes');
    // const authRoute = require('./routes/auth');

    app.use('/pastes', pastesRoute);
    // app.use('/user', authRoute);

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`))
});