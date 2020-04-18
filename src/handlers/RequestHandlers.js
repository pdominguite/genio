const { getRequestType, getIntentName } = require('ask-sdk-core');

exports.LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Bem-vindo ao Gênio Distribuído! Eu te ajudarei na sua automação residencial.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

exports.TurnOnLightHandler = {
  canHandle(handlerInput) {
    console.log(handlerInput)
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && getIntentName(handlerInput.requestEnvelope) === 'TurnOnLightIntent';
  },
  handle(handlerInput) {
    const speechText = "Pronto! Luzes acesas!"
 
  return handlerInput.responseBuilder
    .speak(speechText)
    .getResponse();
  }
};

exports.TurnOffLightHandler = {
  canHandle(handlerInput) {
    console.log(handlerInput)
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && getIntentName(handlerInput.requestEnvelope) === 'TurnOffLightIntent';
  },
  handle(handlerInput) {
    const speechText = "Certo! Apaguei as luzes!"
 
  return handlerInput.responseBuilder
    .speak(speechText)
    .getResponse();
  }
};

exports.HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Você pode dizer "ligue" ou "apague" as luzes!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

exports.CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Até mais!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

exports.SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

exports.ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Desculpe, mas não entendi seu comando! Tente novamente.')
      .reprompt('Desculpe, mas não entendi seu comando! Tente de novo.')
      .getResponse();
  },
};