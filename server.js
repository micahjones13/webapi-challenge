const express = require('express');
const helmet = require('helmet');

const projectsRouter = require('./projects/projects_router.js');
const actionsRouter = require('./actions/actions_router.js');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send('<h1> get on server works! </h1>');
});


//logger middleware to help
function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}]${req.method} to ${req.path}` )
  
    next();
};

server.use(logger);
server.use(helmet());
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

module.exports = server;