var MAX_STICKY = 5;
var stickyCount = 0;
var highlightUsers = [];
var chat = document.querySelector('div.chat-list__lines div[role=log]');
var stickyCont = document.createElement('div');
stickyCont.classList = 'chat-sticky-cont';

var init = function() {
  chat.prepend(stickyCont);
  chatObserver.observe(chat, chatObserverConfig);
};

var chatCallback = function(mutationsList, chatObserver) {
  for (var mutation of mutationsList) {
    if ((mutation.type == 'childList' && mutation.addedNodes.length > 0)) {
      if ((mutation.addedNodes[0].classList.contains('ffz-mentioned') && !mutation.addedNodes[0].classList.contains('sticky'))) {
        mentioned(mutation.addedNodes[0]);
      } else if (highlightUsers.includes(mutation.addedNodes[0].getAttribute('data-user'))) {
        mutation.addedNodes[0].classList += ' ffz-mentioned';
        mentioned(mutation.addedNodes[0]);
      }
    }
  }
};

var chatObserverConfig = { childList: true };
var chatObserver = new MutationObserver(chatCallback);

var mentioned = function(node) {
  stickyCount < MAX_STICKY ? stickyCount++ : stickyCont.firstChild.remove();
  var close = document.createElement('div');
  close.innerText = 'x';
  close.classList = 'close';

  var closeCallback = function(e) {
    e.target.parentNode.remove();
    stickyCount--;
    e.target.removeEventListener('click', closeCallback, false);
  };
  close.addEventListener('click', closeCallback, false);

  var sticky = node.cloneNode(true);
  sticky.classList += ' sticky';
  sticky.prepend(close);
  stickyCont.appendChild(sticky);
};

var addUser = function(name) {
  highlightUsers.push(name.toLowerCase());
};

var removeUser = function(name) {
  highlightUsers.splice(highlightUsers.findIndex(function(e) { return e === name; }), 1);
};

var cstart = function(){
    chatObserver.observe(chat, chatObserverConfig);
}

var cstop = function(){
    chatObserver.disconnect();
}

if (chat !== null) init();