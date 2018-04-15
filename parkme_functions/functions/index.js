'use strict';

process.env.DEBUG = 'actions-on-google:*';

const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);



function getDetails(id, value, ref)
{
    const data = value;
    const sensor = id;
    return {
        status: data.status,
        start: data.start
    };
}


const database = admin.database().ref('Sensors/');
const countRef = database.child('count');
const maxRef = database.child('max');

exports.fetchCount = functions.https.onRequest((request,response)=>{
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    const assistant = new DialogflowApp({request: request, response: response});

    let actionMap = new Map();
    actionMap.set('rush_check', rush_check);
    assistant.handleRequest(actionMap);


    function rush_check(assistanat){
        console.log('inside countFunc');
		
		const max = 4;

        countRef.once('value',snap=>{
            const carCount = snap.val();
			const currentCarValue = max - carCount;
            console.log(`currentCarValue: ${currentCarValue}`);
			
			var speech;
			switch(currentCarValue){
				case 1:
				
				case 0: speech = `<speak>Very Unlikely to get a parking spot</speak>`;
						break;
				case 4:
				
				case 3: speech = `<speak>Very likely to get a parking spot</speak>`;
										break;
				
				case 2: speech = `<speak>Hurry to get a parking spot</speak>`;
										break;
			}

            //const speech = `<speak>
            //No of cars is  ${snap.val()}
            //</speak>`;

            assistant.ask(speech)

        });

    }
});




exports.pushTransaction = functions.database.ref('/Sensors/{id}/status').onUpdate(change=>{
    const rootRef = change.after.ref.parent.parent;
    const status = change.after.val();
    const countRef = rootRef.child('count');
    let increment = 0;
    if(status===0) {
        increment = -1;
    } else if(status === 1) {
        increment = 1;
    }
    return countRef.transaction((current)=>{
        return (current||0)+increment;
    });
});
