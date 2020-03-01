const Alexa = require('ask-sdk-core');

// Start a session
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.SPACE)
      .reprompt(messages.SPACE)
      .getResponse();
  },
};

// Tell the user their fortune
const TellHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'TellIntent';
  },
  handle(handlerInput) {
    var response = 'Today, you will ';
    response += FORTUNE[Math.floor(Math.random()*20)] + '. ' + messages.STOP;
    
    return handlerInput.responseBuilder
      .speak(response)
      .withSimpleCard(skillName, response)
      .getResponse();
  }
};

// Take the users sign and give the user an answer based on their topic
const UserHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && (request.intent.name === 'UserIntent' || request.intent.name === 'ObjectIntent');
  },
  handle(handlerInput) {
    var response = messages.SPACE;
    var value = handlerInput.requestEnvelope.request.intent.slots.Topic.value;
    console.log(value);

    return handlerInput.responseBuilder
      .speak(response)
      .withSimpleCard(skillName, response)
      .reprompt(response)
      .getResponse();
  }
};

// Help the user understand what the skill is for
const HelpHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.SPACE)
      .reprompt(messages.SPACE)
      .getResponse();
  },
};

// Tell the user destiny can't help with that
const FallbackHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.SPACE)
      .reprompt(messages.SPACE)
      .getResponse();
  },
};

// Exit the skill
const ExitHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.SPACE)
      .getResponse();
  },
};

// Log session end
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Handle generic errors
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    return handlerInput.responseBuilder
      .speak(messages.ERROR)
      .getResponse();
  },
};

const skillName = 'Destiny';

const FORTUNE = [
  'run into an old friend',
  'start a new adventure',
  'stand by your convictions, don\'t be pushed around',
  'meet someone new, who will make you smile',
  'finish that job you\'ve been putting off',
  'give a freind the advice they need',
  'help someone in need',
  'see your efforts come to fruition',
  'get the support you need',
  'go with the flow, as great things are coming',
  'find the determination you need',
  'stop underestimating yourself',
  'get the second chance you\'ve been waiting for',
  'find the confidence to make it happen',
  'have a beautiful day',
  'prove yourself',
  'try something new',
  'catch the eye of someone new',
  'explore new opportunities',
  'save someone\'s day with your kindness'
];

const messages = {
  WELCOME: 'Welcome to Destiny, your personal fortune-teller!',
  HELP: 'You can say tell me my fortune, or you can say exit.',
  HELP_REPROMPT: 'Ask me for your fortune.',
  SPACE: '�. ',
  FALLBACK: 'Destiny can\'t help you with that. It can tell you your fortune by saying: tell me my destiny.',
  FALLBACK_REPROMPT: 'To find out your fortune say: tell me my destiny.',
  ERROR: 'Sorry, I couldn\'t fetch your fortune.',
  STOP: 'Have a great day! Goodbye.',
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TellHandler,
    UserHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();