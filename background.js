/*
DO NOT REMOVE, KEEP REFERENCE TO THE AUTHOR.
---
MIT License

Copyright (c) 2022 Breaking IT - Sebastian Stohr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var _port;
var reloaded = false;

function sendMessage() {
    _port.postMessage({
        action: 'run'
    });
}

function triggerRun(tab) {
    try {
        sendMessage();
    } catch (err) {
        chrome.tabs.reload(tab.id);
        reloaded = true;
    }
}

chrome.runtime.onConnect.addListener(function (port) {
    console.log('Connected to: ', port.name);
    _port = port;

    _port.onMessage.addListener(function (msg) {
        if (msg.status === "listening" && reloaded) {
            sendMessage();
            reloaded = false;
        }
    });
});

chrome.action.onClicked.addListener((tab) => {
    switch (tab.url) {
        case 'https://dex.plutus.it/dashboard/statements':
            triggerRun(tab);
            break;
        case 'https://dex.plutus.it/dashboard/trading':
            triggerRun(tab);
            break;
        case 'https://dex.plutus.it/dashboard/pluton':
            triggerRun(tab);
            break;
    }
});

chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let tab = tabs[0];
                if (tab.url === 'https://dex.plutus.it/dashboard/settings/subscriptions') {
                    triggerRun(tab);
                }
            });
        }
    }
);