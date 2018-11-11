/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
      }

// General statement with permission
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' && handlerInput.requestEnvelope.context.System.apiAccessToken;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Welcome to Weather Mood. I can play music depending on the current weather at your location. Say something like play mood to start.")
      .reprompt("")
      .getResponse();
  },
};

// General statement with no permission
const NoAuthHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return !handlerInput.requestEnvelope.context.System.apiAccessToken;
  },
  handle(handlerInput) {  //runs if there are no permissions 
    const permissions = ['read::alexa:device:all:address']; 
    
    return handlerInput.responseBuilder
      .speak("Please set the permissions first.")
      .withAskForPermissionsConsentCard(permissions)
      .getResponse();
  },
}; 


var songArr = [];
var songIndex = 0.0; // = Math.floor(Math.random() * songArr.length); 
var randomSong = null; // = songArr[songIndex];
var songOutput = ''; // = GET_FACT_MESSAGE + randomSong;

var mood = 'Happy'; 

// Play the same mood as the current weather
const GetMoodIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'GetMoodIntent');
  },
  async handle(handlerInput) { 

    // Retrieve Zip Code 
    const serviceClientFactory = handlerInput.serviceClientFactory;
    const { deviceId } = handlerInput.requestEnvelope.context.System.device;
    const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
    const address = await deviceAddressServiceClient.getFullAddress(deviceId);
    const zipCode = address.postalCode; 
    
    
    
    //send zipcode to Weather API (in <stdlib>) 
    
    const https = require("https"); 
    https.get("https://unitingdust.lib.id/test@dev/?zipcode=95045", (resp) => { 
          let data = ''; 
        
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
        
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            mood = data.replace(/['"]+/g, '');   // removes "" (double quotes)

          });
          
  }).on("error", (err) => {
    console.log("Error: " + err.message); 
  }); 
      
    const GET_FACT_MESSAGE = "Playing a " + mood.toLowerCase() + " song"; 
        
      
    switch(mood) { 
      case "Happy": 
        // happy song list 
        songArr = happy; 
        break; 
      case "Calm": 
        // calm song list 
        songArr = calm; 
        break; 
      case "Sad": 
        // sad song list 
        songArr = sad; 
        break; 
      case "Holiday": 
        // holiday music 
        songArr = holiday; 
        break; 
    } 
    songIndex = Math.floor(Math.random() * songArr.length); 
    randomSong = songArr[songIndex]; 
    songOutput = GET_FACT_MESSAGE + randomSong; 
    
    return handlerInput.responseBuilder 
      .speak(songOutput + "Say \"play mood\" to listen to another song. Otherwise say \"stop\" to quit.") 
      .reprompt("")
      .getResponse(); 
  
  },
}; 

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.intent.name === "AMAZON.FallbackIntent"
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Sorry, I can't help you with that right now. I can play you music based on the weather. Say \"play mood\" if you would like that. If not, say \"stop.\" ")
      .reprompt("")
      .getResponse();
  },
};


const SKILL_NAME = 'Space Facts';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const happy = [ 
  '<audio src="https://s3.amazonaws.com/weathersongs/HappySong.mp3" />', 
  '<audio src="https://s3.amazonaws.com/weathersongs/HappyLovely.mp3" />'
]; 

const calm = [ 
  '<audio src="https://s3.amazonaws.com/weathersongs/Calm2.mp3" />', 
  '<audio src="https://s3.amazonaws.com/weathersongs/CalmThatWay.mp3" />' 
]; 

const sad = [  
  '<audio src="https://s3.amazonaws.com/weathersongs/SadRainsong.mp3" />', 
  '<audio src="https://s3.amazonaws.com/weathersongs/CalmPerfect.mp3" />' 
]; 

const holiday = [ 
  '<audio src="https://s3.amazonaws.com/weathersongs/WinterWonderland.mp3" />', 
  '<audio src="https://s3.amazonaws.com/weathersongs/MrGrinch.mp3" />' 
]; 

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    NoAuthHandler,
    GetMoodIntentHandler,
    LaunchRequestHandler,
    HelpHandler,
    ExitHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler 
  ) 
  .addErrorHandlers(ErrorHandler) 


  .lambda();

