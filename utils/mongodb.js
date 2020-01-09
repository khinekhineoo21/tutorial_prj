const fs = require('fs');
const jsYaml = require('js-yaml');
const mongoose = require('mongoose');

class Mongodb {
    static async connect() {
        const mongodb = await this.loadConnectionConfig();
        mongoose.connect(mongodb.url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        });
        let dbconnection = mongoose.connection;
        dbconnection.on("error", console.error.bind(console, "Database connection error"));
        dbconnection.once("open", () => {
            console.log(`database ready on ${process.env.NODE_ENV} server...`);
        });
    }

    static async loadConnectionConfig() {
        const yaml = await fs.readFileSync('./config/mongodb.yml', 'utf-8');
        const config = jsYaml.safeLoad(yaml);
        let database = {};
        console.log("process.env.NODE_ENV >>> ", process.env.NODE_ENV)
        switch(process.env.NODE_ENV) {
        case 'test':
            database = config.test;
            break;
        case 'dev':
            database = config.dev;
            break;
        case 'prod':
            database = config.prod;
            break;
        default:
            database = config.dev;
            break;
        }
        return database;
    }

}

module.exports = Mongodb;