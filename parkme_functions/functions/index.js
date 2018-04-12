'use strict';

process.env.DEBUG = 'actions-on-google:*';

const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


const database = admin.database().ref('count/');
const countRef = database.child('count');

exports.fetchCount = functions.https.onRequest((request,response)=>{
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    const assistant = new DialogflowApp({request: request, response: response});

    let actionMap = new Map();
    actionMap.set('rush_check', rush_check);
    assistant.handleRequest(actionMap);


    function rush_check(assistanat){
        console.log('inside countFunc');

        countRef.once('value',snap=>{
            const carCount = snap.val();
            console.log(`carCount: ${carCount}`);

            const speech = `<speak>
            No of cars is  ${snap.val()}
            </speak>`;

            assistant.ask(speech)

        });

    }
});