const express = require('express');
const Alexa = require('ask-sdk-core');

const { ExpressAdapter } = require('ask-sdk-express-adapter');

const handlers = require('./handlers/RequestHandlers');

const app = express();

const skillBuilder = Alexa.SkillBuilders.custom();
skillBuilder.addRequestHandlers(handlers.LaunchRequestHandler);
skillBuilder.addRequestHandlers(handlers.TurnOffLightHandler);
skillBuilder.addRequestHandlers(handlers.TurnOnLightHandler);
skillBuilder.addRequestHandlers(handlers.HelpIntentHandler);
skillBuilder.addRequestHandlers(handlers.CancelAndStopIntentHandler);
skillBuilder.addRequestHandlers(handlers.SessionEndedRequestHandler);
skillBuilder.addRequestHandlers(handlers.FallbackIntentHandler);
skillBuilder.addRequestHandlers(handlers.ErrorHandler);

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, true, true);

const port = process.env.PORT || 3333;

app.get('/', (req, res) => {
  return res.status(200).json({
    "message" : "This is a Node.js server for an Alexa Skill."
  });
});

app.post('/genio', adapter.getRequestHandlers());

app.listen(port, () => {
  console.log("Server started!");
});