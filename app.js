const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const fs = require('fs');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const typeDefs = fs.readFileSync('./schema.graphql',{ encoding:'utf-8' });
const  resolvers = require('./resolver');
const schema = makeExecutableSchema({ typeDefs, resolvers });
const Mongodb = require('./utils/mongodb');
const port = process.env.NODE_ENV !== 'local' ? 4000: 3000;
const app = express();

Mongodb.connect(); // connect with mongodb

app.use(cors()); // to enable with cross platform
app.use(logger('dev')); // to enable console log
app.use(bodyParser.json()); // request body to json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.set('etag', false);

app.use('/graphql', graphqlExpress((req) => {
  return {
    schema,
    context: {
      headers: req.headers
    }
  }
}));
app.use('/graphiql', graphiqlExpress({ endpointURL:'/graphql' }));

app.listen(port, ()=> {
  console.log(`${process.env.NODE_ENV} server and port no: ${port}...`);
})