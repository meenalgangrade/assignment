const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const haikuHandler = require('./haikuHandler');
const fs = require("fs");
const request = require('request');
const url = process.env.MONGO_DB_HOST || "mongodb://127.0.0.1:27017/";

function initiateConnection(){
    return new Promise((resolve,reject) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            let dbo = db.db("HaikuDB");
            resolve(dbo);
        });
    }) 
}
function getStats(){
    return new Promise((resolve, reject) => {
        let db = undefined;
        initiateConnection().then(databaseObject => {
            db = databaseObject;
            db.stats(function(err,stats){
                console.log(stats);
                resolve(stats);
            });
        }).catch((err) => {
            console.log(err);
            reject(err);
        }).finally(()=>{
            if(db)db.close();
        });
    });
}
function getHaiku(){
    return new Promise((resolve,reject) => {
        let db = undefined;
        initiateConnection().then(databaseObject => {
            db = databaseObject;
            db.collection("Haikus").aggregate([{$match:{ user3: null}}, { $sample: { size: 1 }}]).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                resolve(result);
            });
        }).catch((err) => {
            console.log(err);
        }).finally(()=>{
            if(db)db.close();
        });
    }) 
}
function getHaikuById(haikuId){
    return new Promise((resolve,reject) => {
        let db = undefined;
        initiateConnection().then(databaseObject => {
            db = databaseObject;
            db.collection("Haikus").find({"_id":haikuId}).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                resolve(result); 
            });
        }).catch((err) => {
            console.log(err);
        }).finally(()=>{
            if(db)db.close();
        });
    })  
}
function updateHaiku(haikuId, userId, line){
    return new Promise((resolve,reject) => {
        let db = undefined;
        initiateConnection().then(databaseObject => {
            db = databaseObject;
            getHaikuById(haikuId).then(result => {
                document = result[0];
                    if(!document){
                        return;
                    }
                    let hasDocumentChanged = false;
                    if(!document.line1){
                        document.line1 = line;
                        document.user1 = userId;
                        hasDocumentChanged = true;
                    }
                    else if(!document.line2){
                        document.line2 = line;
                        document.user2 = userId;
                        hasDocumentChanged = true;
                    }
                    else if(!document.line3){
                        document.line3 = line;
                        document.user3 = userId;
                        hasDocumentChanged = true;
                    }
                    if(hasDocumentChanged){
                        db.collection("Haikus").updateOne({"_id": haikuId}, {$set:document}, function(err, res) {
                            if (err) throw err;
                            console.log("1 document updated");
                            resolve("document updated");
                        });
                    }
                    else{
                        resolve("no document updated");
                    }
            });
        }).catch(err=>{
            console.log("Error in initiating connection: "+err);
            reject();
        }).finally(()=>{
            if(db)db.close();
        });
    })
}

module.exports = {
    initiateConnection,
    getStats,
    getHaiku,
    updateHaiku
}