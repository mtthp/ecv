function addLeadingZero(i) {
  if (i < 10) i = "0" + i
    return i
}

function addMessage(message, isMe) {
  var element = document.createElement('div')
  element.classList.add('message')
  element.classList.add(isMe ? 'me' : 'them')
  var date = document.createElement('div')
  date.classList.add('date')
  var d = new Date();
  var h = addLeadingZero(d.getHours())
  var m = addLeadingZero(d.getMinutes())
  var s = addLeadingZero(d.getSeconds())
  date.innerHTML = h + ":" + m + ":" + s;
  element.appendChild(date)
  var elementContent = document.createElement('p')
  elementContent.innerHTML = message
  element.appendChild(elementContent)

  document.querySelector('.messages').appendChild(element)
  document.querySelector('.messages .message:last-child').scrollIntoView(true)
}

function toggleType(bool, isMe) {
  var typingIndicator = document.querySelector('.messages .typing-indicator.' + (isMe ? 'me' : 'them'))
  if (bool) {
    if (!typingIndicator) {
      var typingIndicator = document.createElement('div')
      typingIndicator.classList.add('typing-indicator')
      typingIndicator.classList.add(isMe ? 'me' : 'them')
      typingIndicator.innerHTML = '<span></span><span></span><span></span>'
      document.querySelector('.messages').appendChild(typingIndicator)
      document.querySelector('.messages .typing-indicator:last-child').scrollIntoView(true)
    }
  } else {
    if (typingIndicator) {
      document.querySelector('.messages').removeChild(typingIndicator)
    }
  }
}

const client = new ApiAi.ApiAiClient({accessToken: '8abb2eb744ea4fd285e1e41406883a44'});
function sendMessage(message) {
  toggleType(true, false)

  client.textRequest(message)
  .then(function handleResponse(serverResponse) {
    console.log(serverResponse);
    toggleType(false, false)
    if (serverResponse.result.fulfillment.speech) addMessage(serverResponse.result.fulfillment.speech, false)
  })
  .catch(function handleError(serverError) {
    console.warn(serverError);
    toggleType(false, false)
  });
}

function sendEvent(eventName) {
  toggleType(true, false)

  client.eventRequest(eventName)
  .then(function handleResponse(serverResponse) {
    console.log(serverResponse);
    toggleType(false, false)
    if (serverResponse.result.fulfillment.speech) addMessage(serverResponse.result.fulfillment.speech, false)
  })
  .catch(function handleError(serverError) {
    console.warn(serverError);
    toggleType(false, false)
  });
}