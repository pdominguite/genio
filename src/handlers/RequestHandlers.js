const { getRequestType, getIntentName, getSlotValue } = require('ask-sdk-core');

const request = require('request-promise');

const mqtt = require('mqtt');

const mqtt_addr = process.env.MQTT_ADDR || 'mqtt://try:try@broker.shiftr.io'

const mqtt_broker = process.env.MQTT_BROKER || 'http://try:try@broker.shiftr.io'

const client = mqtt.connect(mqtt_addr, {
  clientId: 'genio-distribuido'
});

exports.LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Olá, sou o Gênio Distribuído! Eu te ajudarei na sua automação residencial. Peça "ajuda" aqui mesmo se você não me conhece.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Gênio Distribuído', speechText)
      .getResponse();
  }
};

exports.TurnOnLightHandler = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && getIntentName(handlerInput.requestEnvelope) === 'TurnOnLightIntent';
  },
  handle(handlerInput) {
    const speechText = "Pronto! Luz acesa!"
    client.publish('/light', '1');
  return handlerInput.responseBuilder
    .speak(speechText)
    .getResponse();
  }
};

exports.TurnOffLightHandler = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && getIntentName(handlerInput.requestEnvelope) === 'TurnOffLightIntent';
  },
  handle(handlerInput) {
    const speechText = "Certo! Apaguei a luz!"
    client.publish('/light', '0'); 
  return handlerInput.responseBuilder
    .speak(speechText)
    .getResponse();
  }
};

exports.SetTemperature = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && getIntentName(handlerInput.requestEnvelope) === 'SetTemperature';
  },
  handle(handlerInput) {
    const speechText = "Pronto! Alterei a temperatura!"
    client.publish('/temperature', Number(getSlotValue(handlerInput.requestEnvelope, 'Temperature')).toFixed(1)); 
  return handlerInput.responseBuilder
    .speak(speechText)
    .getResponse();
  }
};

exports.GetTemperature = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && getIntentName(handlerInput.requestEnvelope) === 'GetTemperature';
  },
  async handle(handlerInput) {
    let speechText = "";
    await request.get(mqtt_broker + '/temperature', (error, response, body) => {
      if (response.statusCode === 200) {
        if (!Number(body)) {
          speechText = `Desculpe, mas não consegui obter a temperatura.`
        } else {
          speechText = `A temperatura do ambiente nesse momento é de ${Number(body)} graus!`
        }
      } else {
        speechText = `Desculpe, mas não consegui obter a temperatura.`
      }
    });
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
      .withSimpleCard('Gênio Distribuído', speechText)
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
      .withSimpleCard('Gênio Distribuído', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

exports.SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

exports.FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const speechText = 'Não conheço esse comando. Tente de novo.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Gênio Distribuído', speechText)
      .getResponse();
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