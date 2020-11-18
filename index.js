const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const haikuHandler = require('./haikuHandler');
const fs = require("fs");
const request = require('request');
const url = process.env.MONGO_DB_HOST || "mongodb://127.0.0.1:27017/";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
function getAddress(key){
    const value = pincodes[key];
    return value;
}

app.post("/stats", async(req, res, next) => {
    haikuHandler.getStats().then(statsObject=>{
        res.send(JSON.stringify(statsObject, null, 4));
    }).catch(err=>{
        res.send("Following error occurred in retrieving stats for HaikuDB: "+JSON.stringify(err));
    });
});
app.get("/getHaiku", async(req, res, next) => {
    haikuHandler.getHaiku().then((haiku)=>{
        let objectToSend = JSON.stringify(haiku[0], null, 4);
        res.send(objectToSend);
    }).catch(err=>{
        res.send("Error in fetching haiku: "+err);
    })
});
app.post("/updateHaiku", async(req, res, next) => {
    const haikuId = req.body.haikuId;
    const text = req.body.line;
    const haikuUserId = req.body.userId;
    if(!text || !haikuId || !haikuUserId){
        res.send("Please provide all required details");
    }
    else{
        haikuHandler.updateHaiku(Number(haikuId),haikuUserId,text).then(message=>{
            res.send(message);
        }).catch(err=>{
            res.send("Error in updating document");
        });
    }
});
                                  
app.listen(3000, () => {  
    console.log("Server running on port 3000");
});