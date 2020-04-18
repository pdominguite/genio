const express = require('express');
const alexa = require('ask-sdk');

const app = express();

const port = process.env.PORT || 3334;

app.use(express.json());

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const speechText = 'Luz acesa!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

app.get('/', (req, res) => {
  return res.status(200).send("OK");
});

app.get('/genio/index', (req, res) => {
  console.log(req.body.request.intent);
  console.log(req.headers);
  return res.status(200).json({
    "message":"OK"
  });
})

app.post('/genio', (req, res) => {
  //console.log(req.body.request.intent);
  return LaunchRequestHandler;
})

app.listen(port, () => {
  console.log("Server started!");
});