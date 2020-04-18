const { getRequestType, getIntentName } = require('ask-sdk-core');

const mqtt = require('mqtt');

const mqtt_addr = process.env.MQTT_ADDR || 'mqtt://try:try@broker.shiftr.io'

const client = mqtt.connect(mqtt_addr, {
  clientId: 'genio-da-lampada'
});

exports.LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Olá, sou o Gênio da Lâmpada! Eu te ajudarei na sua automação residencial. Peça "ajuda" aqui mesmo se você não me conhece.';

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
    client.publish('/light', '1');
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
    client.publish('/light', '0'); 
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
    const speechText = 'Por enquanto, você pode dizer "ligue" ou "apague" as luzes!';

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