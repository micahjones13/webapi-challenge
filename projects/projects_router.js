const express = require('express');

const Projects = require('../data/helpers/projectModel.js');
const Actions = require('../data/helpers/actionModel.js');

const projectRouter = express.Router();
projectRouter.use(express.json());


//GET all 
projectRouter.get('/', (req, res) => {
    Projects.get()
    .then(project => {
        res.status(200).json(project);
    })
    .catch(err => {
        res.status(500).json({ errormessage: "Cannot retrieve projects" });
    })
})

//GET specific
projectRouter.get('/:id', validateID, (req, res) => {
    //validateID basically does this for us
    res.status(200).json(req.project);
})
//GET ACTIONS FOR A PROJECT 
projectRouter.get('/:project_id', validateActionID, (req, res) => {
    const project_id = req.params.id;
    Projects.getProjectActions(project_id)
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: "Could not retrieve actions for that project" });
    })
})

//POST new project
projectRouter.post('/', (req, res) => {
    postInfo = req.body;
    if(!postInfo.name || !postInfo.description){
        res.status(400).json({ message: "Please give a name and description" });
    } else {
        Projects.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: "Cannot create new project" });
        })
    }
})

//DELETE
projectRouter.delete('/:id', validateID, (req, res) => {
    const { id } = req.params;
  
    Projects.remove(id)
    .then(removed => {
        res.status(200).json(removed);
    })
    .catch(err => {
        res.status(500).json({ error: "Cannot Delete" });
    })
    
  
})

//UPDATE
projectRouter.put('/:id', validateID, (req,res) => {
    const id = req.params.id;
    const changes = req.body;
    if(!changes.name || !changes.description){
        res.status(400).json({ message: "Please enter a name and description to be updated" });
    } else {
        Projects.update(id, changes)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not update project" });
        })
    }
})

//custon middleware
//make sure the ID is valid
function validateID (req, res, next) {
    const id = req.params.id;

    Projects.get(id)
    .then(project => {
        if(project){
            req.project = project;
            next();
        } else {
            res.status(404).json({ error: "ID not found" })
        }
    })
}

function validateActionID (req, res, next) {
    const id = req.params.id
    console.log(req.params);

    Actions.get(id)
    .then(action => {
        if(action){
            req.action = action;
            next();
        } else {
            res.status(404).json({ error: "Action ID not found" })
        }
    })
}


module.exports = projectRouter;