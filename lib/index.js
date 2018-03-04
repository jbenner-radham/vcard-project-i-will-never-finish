'use strict';

const Bq = require('@becquerel/framework');
const mongoose = require('mongoose');
const Card = require('./Card');
const demongoify = require('./demongoify');

const app = new Bq();
const host = (process.env['NODE_ENV'] === 'production') ? 'db' : 'localhost';
const collection = 'cards';
const url = `mongodb://${host}/${collection}`;

const getBody = (incomingMessage) => {
    return new Promise((resolve, reject) => {
        let body = '';

        incomingMessage.on('abort', () => reject(new Error('aborted')));
        incomingMessage.on('data', chunk => body += chunk.toString());
        incomingMessage.on('end', () => resolve(body));
        incomingMessage.on('error', (error) => reject(error));
    });
}

mongoose.connect(url);

app.route('/@/{id}', {
    get: async (request, response) => {
        if (!await Card.findOne({_resourceId: 'james.benner'})) {
            await new Card({
                _resourceId: 'james.benner',
                name: 'James Benner'
            }).save();
        }

        const criterion = {_resourceId: request.uriVariables.id};
        response.json = demongoify(await Card.findOne(criterion));
        response.contentType = 'application/jf2+json';
    },
    post: async (request, response) => {
        const id = request.uriVariables.id;
        const stream = request.incomingMessage;
        const body = await getBody(stream);

        if (await Card.findOne({_resourceId: id})) {
            try {
                await Card.findOneAndUpdate({_resourceId: id}, JSON.parse(body));
                console.log(`Updated ${id}.`);
            } catch (error) {
                console.error(error);
            }

            return;
        }

        try {
            await new Card({...JSON.parse(body), _resourceId: id}).save();
            console.log(`Created ${id}.`);
        } catch (error) {
            console.error(error);
        }
    }
});

app.run();

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});
