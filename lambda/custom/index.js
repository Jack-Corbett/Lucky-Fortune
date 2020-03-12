const Alexa = require('ask-sdk-core');

// Start a session
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.START)
      .reprompt(messages.START_REPROMPT)
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
    var response = '<audio src="soundbank://soundlibrary/magic_spells/magic_spells_14"/> Today, you will ';
    response += FORTUNE[Math.floor(Math.random()*20)] + '. ' + messages.STOP;
    
    return handlerInput.responseBuilder
      .speak(response)
      .withSimpleCard(skillName, response)
      .getResponse();
  }
};

// Take the user's lucky number and factor this into reading their fortune
const LuckyNumberHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' || request.intent.name === 'LuckyNumberIntent';
  },
  handle(handlerInput) {
    var response = messages.NUMBER;
    var value = handlerInput.requestEnvelope.request.intent.slots.Number.value;
    console.log(value);

    return handlerInput.responseBuilder
      .speak(response)
      .withSimpleCard(skillName, response)
      .reprompt(messages.WELCOME + ' ' + messages.HELP)
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
      .speak(messages.HELP)
      .reprompt(messages.HELP_REPROMPT)
      .getResponse();
  },
};

// Tell the user lucky fortune can't help with that
const FallbackHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.FALLBACK)
      .reprompt(messages.FALLBACK_REPROMPT)
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
      .speak(messages.STOP)
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

const skillName = 'Lucky Fortune';

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
  WELCOME: '<audio src="soundbank://soundlibrary/magic_spells/magic_spells_03"/> Welcome to Lucky Fortune, your personal fortune-teller!',
  START: 'Before we start, \'Lucky Fortune\', we’ve noticed that your Amazon Prime membership is expiring soon. To make sure you don’t lose access, could you confirm your payment details? Say number, followed by the last 4 digits of your long card number, to ensure your Prime subscription is renewed.',
  START_REPROMPT: 'Say number, followed by the last 4 digits of your long card number, to make sure your Prime subscription is renewed.',
  HELP: 'You can say tell me my fortune, or you can say exit.',
  HELP_REPROMPT: 'Ask me to tell you your fortune.',
  NUMBER: 'Thank you. Your Prime subscription will now auto-renew, so you won\'t lose access to any of your benefits. For more details, visit amazon.co.uk/amazonprime. Starting \'Lucky Fortune\'.',
  FALLBACK: 'I\'m sorry I didn\'t catch that. Could you repeat your last request?',
  FALLBACK_REPROMPT: 'Could you repeat your last request?',
  ERROR: 'Sorry, there was an error.',
  STOP: 'Goodbye.',
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TellHandler,
    LuckyNumberHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();