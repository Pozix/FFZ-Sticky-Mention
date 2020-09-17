var MAX_STICKY = 5;
var stickyCount = 0;
var highlightUsers = [];

var stickyCont = document.createElement('div');
stickyCont.classList = 'chat-sticky-cont';
var chat = document.querySelector('section.chat-room div[role=log]');
var type = 'live';

var init = function() {
    console.log("In init");
    if (chat === null) {
        chat = document.querySelector('section.chat-room div[role=log]');
        type = 'live';
    }
    if (chat === null) {
        chat = document.querySelector('div.video-chat__message-list-wrapper > div > ul');
        type = 'vod';
    }
    if (chat !== null) {
        chat.prepend(stickyCont);
        chatObserver.observe(chat, chatObserverConfig);
    }
};

var chatCallback = function(mutationsList, chatObserver) {
    for (var mutation of mutationsList) {
        if ((mutation.type == 'childList' && mutation.addedNodes.length > 0)) {
            if (type === 'live') {
                if ((mutation.addedNodes[0].classList.contains('ffz-mentioned') && !mutation.addedNodes[0].classList.contains('sticky'))) {
                    mentioned(mutation.addedNodes[0]);
                } else if (highlightUsers.includes(mutation.addedNodes[0].getAttribute('data-user'))) {
                    mutation.addedNodes[0].classList += ' ffz-mentioned';
                    mentioned(mutation.addedNodes[0]);
                }
            } else if (type === 'vod') {
                if (highlightUsers.includes(mutation.addedNodes[0].querySelector('div[data-user]').getAttribute('data-user')) && !mutation.addedNodes[0].querySelector('div[data-user]').classList.contains('sticky') && !mutation.addedNodes[0].querySelector('div[data-user]').classList.contains('ffz-mentioned')) {
                    mutation.addedNodes[0].querySelector('div[data-user]').classList += ' chat-line__message ffz-mentioned';
                    mentioned(mutation.addedNodes[0].querySelector('div[data-user]'));
                }
            }
        }
    }
};

var chatObserverConfig = {
    childList: true
};
var chatObserver = new MutationObserver(chatCallback);

var mentioned = function(node) {
    stickyCount < MAX_STICKY ? stickyCount++ : stickyCont.firstChild.remove();
    var close = document.createElement('div');
    close.innerText = 'x';
    close.classList = 'close';

    var closeCallback = function(e) {
        e.target.removeEventListener('click', closeCallback, false);
        e.target.parentNode.remove();
        stickyCount--;
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
    highlightUsers.splice(highlightUsers.findIndex(function(e) {
        return e === name;
    }), 1);
};

var cstart = function() {
    console.log("In cstart");
    chatObserver.observe(chat, chatObserverConfig);
};

var cstop = function() {
    console.log("In cstop");
    chatObserver.disconnect();
};

var header = document.querySelector('.video-chat__header');
var buttons = ['init', 'cstart', 'cstop'];
header === null ? header = document.querySelector('.stream-chat-header') : false;
if (header) {
    for (var i = 0; i < buttons.length; i++) {
        var btn = document.createElement('button');
        btn.classList = "cbutton";
        btn.innerText = buttons[i];
        btn.onclick = window[buttons[i]];
        header.append(btn);
    }
}

init();