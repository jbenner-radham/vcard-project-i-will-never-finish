'use strict';

const Bq = require('@becquerel/framework');
const mongoose = require('mongoose');
const Card = require('./Card');
const demongoify = require('./demongoify');

const app = new Bq();
const host = (process.env['NODE_ENV'] === 'production') ? 'db' : 'localhost';
const collection = 'cards';
const url = `mongodb://${host}/${collection}`;

mongoose.connect(url);

app.route('/', {
    get: async (request, response) => {
        if (!await Card.findOne({nickname: 'jbenner'})) {
            await new Card({name: 'James Benner', nickname: 'jbenner'}).save();
        }

        response.json = demongoify(await Card.findOne({nickname: 'jbenner'}));
    }
});

app.run();

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});
