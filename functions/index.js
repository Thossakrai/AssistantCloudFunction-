'use strict';

const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google')
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const mqtt = require('mqtt');
const url = require('url');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true
});


process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

// const app = dialogflow();

// const setting = { timestampsInSnapshots: true };
// db.settings(setting);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    


    // client.on('connect', function () {
    //     client.subscribe('Thossakrai/Light');
    //     console.log('client has subscribed successfully');
    //   });

    function lighton(agent) {
        const mqttUrl = url.parse('mqtt://broker.hivemq.com');
        const client = mqtt.connect(mqttUrl);
        client.on('connect', () => {

        }        )
        client.subscribe('Thossakrai/Light');
        client.publish('Thossakrai/Light', 'on');
        client.end();
        // client.on('connect', function () {
        //     client.publish('Thossakrai/Light', 'on');
        // });
        // const dialogflowAgentRef = db.collection('LED').doc('LED');

        // dialogflowAgentRef.update({
        //     isOn: true,
        // }).then(() => {
        //     agent.add("Roger that, light is turning on");
        // }).catch(() => {
        //     agent.add("Sorry. Please try again later.");
        // });
    }

    function lightoff(agent) {
        var dialogflowAgentRef = db.collection('LED').doc('LED');
        client.on('connect', () => {
            client.publish('Thossakrai/Light', 'off');
        })
        return dialogflowAgentRef.update({
            isOn: false
        }).then(() => {
            agent.add("Roger that, light is turning on");
        }).catch(() => {
            agent.add("Sorry. Please try again later.");
        });
    }

    let intentMap = new Map();
    intentMap.set('lightturnon', lighton);
    intentMap.set('lightturnoff', lightoff);
    agent.handleRequest(intentMap);
});

// exports.updateLightStatus = functions.firestore
//     .document('LED/{isOn}')
//     .onUpdate((change, context) => {
//         const newValue = change.after.data();
//         console.log("new value is" + newValue.isOn);
//         client.on('connect', function () {
//             client.subscibe('Thossakrai/Light', function () {
//                 console.log("status updated");
//                 return client.publish('Thossakrai/Light', 'on');
//             })
//         })
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}


//         // ...or the previous value before this update
//         const previousValue = change.before.data();

//         // access a particular field as you would any JS property
//         const name = newValue.name;

//         // perform desired operations ...
//     });




// function turnLightOn(dialogflowAgentRef) {
//     dialogflowAgentRef.update({
//         isOn: true
//     });
// }

    // app.intent('lighturnon', (conv, { lights, status }) => {
    //     conv.ask("Ok, The ${lights} is ${status} ");
    //     var dialogflowAgentRef = db.collection('LED').doc('LED');
    //     dialogflowAgentRef.update({
    //         isOn: true
    //     });
    // })

    // app.intent('lightturnoff', (conv, { lights, status }) => {
    //     conv.ask("Ok, The ${lights} is ${status}");
    //     const dialogflowAgentRef = db.collection('LED').doc('LED');
    //     dialogflowAgentRef.update({
    //         isOn: false
    //     });
    // })




// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
//     const agent = new WebhookClient({ request, response });

//     function lightoff(agent) {
//         console.log("light off triggered");
//         const dialogflowAgentRef = db.collection('LED').doc('LED');
//         return dialogflowAgentRef.update({
//             isOn: false
//         }).then(console.log("OFF Document successfully updated!"));
//     };

//     function lighton(agent) {
//         const dialogflowAgentRef = db.collection('LED').doc('LED');
//         return dialogflowAgentRef.update({
//             isOn: true
//         }).then(console.log("Document successfully updated!"));
//     };



//     // Map from Dialogflow intent names to functions to be run when the intent is matched
//     let intentMap = new Map();
//     //   intentMap.set('ReadFromFirestore', readFromDb);
//     //   intentMap.set('WriteToFirestore', writeToDb);
//     intentMap.set('lightturnon', lighton);
//     intentMap.set('lightturnoff', lightoff);
//     agent.handleRequest(intentMap);


//     // .catch(function(error) {
//     //     // The document probably doesn't exist.
//     //     console.error("Error updating document: ", error);
//     // });

//     //   function writeToDb (agent) {
//     //     // Get parameter from Dialogflow with the string to add to the database
//     //     const databaseEntry = agent.parameters.databaseEntry;

//     //     // Get the database collection 'dialogflow' and document 'agent' and store
//     //     // the document  {entry: "<value of database entry>"} in the 'agent' document
//     //     const dialogflowAgentRef = db.collection('dialogflow').doc('agent');
//     //     return db.runTransaction(t => {
//     //       t.set(dialogflowAgentRef, {entry: databaseEntry});
//     //       return Promise.resolve('Write complete');
//     //     }).then(doc => {
//     //       agent.add(`Wrote "${databaseEntry}" to the Firestore database.`);
//     //     }).catch(err => {
//     //       console.log(`Error writing to Firestore: ${err}`);
//     //       agent.add(`Failed to write "${databaseEntry}" to the Firestore database.`);
//     //     });
//     //   }

//     //   function readFromDb (agent) {
//     //     // Get the database collection 'dialogflow' and document 'agent'
//     //     const dialogflowAgentDoc = db.collection('dialogflow').doc('agent');

//     //     // Get the value of 'entry' in the document and send it to the user
//     //     return dialogflowAgentDoc.get()
//     //       .then(doc => {
//     //         if (!doc.exists) {
//     //           agent.add('No data found in the database!');
//     //         } else {
//     //           agent.add(doc.data().entry);
//     //         }
//     //         return Promise.resolve('Read complete');
//     //       }).catch(() => {
//     //         agent.add('Error reading entry from the Firestore database.');
//     //         agent.add('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
//     //       });
//     //   }


// });

