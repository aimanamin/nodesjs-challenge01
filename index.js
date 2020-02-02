const express = require('express');

const server = express();

var countRequests = 0;

server.listen(3000);

server.use(express.json());

server.use((req, res, next) => {
  console.log("Número de requisição =", ++countRequests);
  return next();
});

function checkIndexIsString(req, res, next){
  if (typeof req.body.id === "number"){
    req.body.id = req.body.id.toString();
  };
  return next();
};

function checkIfItemExists(req, res, next) {
  const {id} = req.params;
  const item = collection.find(function(item){
    return item["id"] === `${id}`;
  });
  if(!item){
    return res.status(400).send("Item doesn't exists");
  };
  return next();
};

var collection = [{id: "0", title: "Learning NodesJS", tasks: []}];

server.get("/projects", (req, res)=>{
  return res.json(collection);
});

server.post("/projects", checkIndexIsString, (req, res)=> {
  const {id, title} = req.body;
  collection.push({id, title, tasks:[]});
  return res.send("New project added");
});

server.put("/projects/:id", checkIfItemExists, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;
  const item = collection.find(function(item){
    return item["id"] === `${id}`;
  });
  item["title"] = title;
  return res.send("record updated")
});

server.delete("/projects/:id", checkIfItemExists, (req, res) => {
  const {id} = req.params;
  const index = collection.findIndex(item => item["id"] === `${id}`);
  collection.splice(index, 1);
  return res.send("Project Deleted");
});

server.post("/projects/:id/tasks", checkIfItemExists, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;
  const item = collection.find(function(item){
    return item["id"] === `${id}`;
  });
  item["tasks"].push(title);
  res.send("Task added to project");
});

