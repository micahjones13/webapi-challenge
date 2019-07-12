const express = require('express');

const Actions = require('../data/helpers/actionModel.js');

const actionRouter = express.Router();
actionRouter.use(express.json());

//GET
actionRouter.get('/', (req, res) => {
    
    Actions.get()
    .then(action =>{
        res.status(200).json(action);
    })
    .catch(err => {
        res.status(500).json({ error: "Could not get actions" });
    })
})

//GET SPECIFC
actionRouter.get('/:id',  (req, res) => {
    const id= req.params.id;
    Actions.get(id)
    .then(action => {
        if (action){
            res.status(200).json(action);
        } else {
            res.status(404).json({ error: "Could not find action with that ID" })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Could not get that action" }); //always lands on this if ID doesn't exist for some reason
    })

})

//POST
actionRouter.post('/', validateBodyContents, (req, res) => {
    const body = req.body;
    Actions.insert(body)
    .then(action => {
        res.status(201).json(action);
    })
    .catch(err => {
        res.status(500).json({ error: "Could not create action" });
    })
})

//PUT
actionRouter.put('/:id', validateBodyContents, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    Actions.update(id, changes)
    .then(updated => {
        if(updated){
            res.status(200).json(updated);
        } else {
            res.status(404).json({ error: "Could not find action with that ID" });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Cannot update action" });
    })

})

//DELETE
actionRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    Actions.remove(id)
    .then(removed => {
        if(removed > 0){
            res.status(200).json(removed);
        } else {
            res.status(404).json({ error: "action with that ID not found" });
        }
    })
   
})
//middleware
//This function would cause requests to spin forever. Got the error of cannot read property completed of undefined somewehre
//in the mapping file


// function validateActionID (req, res, next) {
//     const id = req.params.id
//     console.log(req.params);

//     Actions.get(id)
//     .then(action => {
//         if(action){
//             req.action = action;
//             next();
//         } else {
//             res.status(404).json({ error: "Action ID not found" })
//         }
//     })
// }
function validateBodyContents (req, res, next) {
    const body = req.body;
    if(!body.project_id || !body.description || !body.notes){
        res.status(400).json({ error: "Please put a project_id, description and notes" });
    } else {
        next();
    }
}



module.exports = actionRouter;

// actionRouter.delete('/:id', (req, res) => {
//     const id = req.params.id;
   
//     Actions.remove(id)
//     .then(removed => {
//         res.status(200).json(removed);
//     })
//     .catch(err => {
//         res.status(500).json({ error: "Could not delete action" });
//     })
// })

// actionRouter.delete('/:id', (req, res) => {
//     const id = req.params.id;
//     Actions.get(id)
//     .then(action => {
//         if(action){
//             Actions.remove(id)
//             .then(removed => {
//                 res.status(200).json(removed);
//             })
//             .catch(err => {
//                 res.status(500).json({ error: "Could not delete action" });
//             })
//         } else {
//             res.status(404).json({ error: "Action not found" });
//         }
//     })
   
// })