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

function sendMessage(action) {
    _port.postMessage({
        action: action
    });
}

function triggerRun(tab, action) {
    try {
        sendMessage(action);
    } catch (err) {
        chrome.tabs.reload(tab.id);
        reloaded = true;
    }
}

async function submitCardDetails(input) {
    const number = input.CardNumber;
    const month = input.MM;
    const year = input.YYYY;
    const cvc = input.CVC;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "pk_tsglnhft2nk2kk33lcfhwsmxyu5");
    myHeaders.append("Content-Type", "application/json");

    var json_data = JSON.stringify({
        'type': 'card',
        'number': number,
        'expiry_month': month,
        'expiry_year': year,
        'cvv': cvc,
        'billing_address': null,
        'phone': {}
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: json_data
    };

    return await fetch("https://api.checkout.com/tokens", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.token; })
        .catch(err => console.warn(err));
}

async function createPayment(id_token, token, plan) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + id_token);
    myHeaders.append("Content-Type", "application/json");

    var json_data = JSON.stringify({
        'token': token,
        'plan': plan,
        'paymentType': 'Recurring'
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: json_data
    };

    return await fetch("https://cors-anywhere-05423.herokuapp.com/https://api.plutus.it/v2/subscription/initial-charge", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.redirectTo; })
        .catch(err => console.warn(err));
}

function createPayLink(link) {
    if (typeof link !== 'undefined') {
        if (link.startsWith("https://api.checkout.com/sessions-interceptor/sid_")) {
            return '<a href="' + link + '" target="_blank"><button style="-webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; box-sizing: inherit; line-height: 1.15; margin: 0; overflow: visible; text-transform: none; font-family: Graphik; position: relative; height: 56px; outline: none; width: 100%; padding: 0 20px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s ease; background: #2569db; color: #fff; border: 0; border-radius: 28px; -webkit-appearance: button; width: 220px;" onclick="this.disabled=true; this.innerHTML=\'Continue in new tab\'; this.setAttribute(\'style\',\'-webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-box-direction: normal; box-sizing: inherit; line-height: 1.15; margin: 0; overflow: visible; text-transform: none; font-family: Graphik; position: relative; height: 56px; outline: none; padding: 0 20px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s ease; color: #fff; border: 0; border-radius: 28px; -webkit-appearance: button; width: 220px; background: #ececec;\')">Complete Payment</button></a>';
        }
    }

    return "An error occured. No payment was made."
}

chrome.runtime.onConnect.addListener(function (port) {
    console.log('Connected to: ', port.name);
    _port = port;

    _port.onMessage.addListener(function (msg) {
        if (msg.status === "listening" && reloaded) {
            sendMessage(msg.action);
            reloaded = false;
        }
    });
});

chrome.action.onClicked.addListener((tab) => {
    switch (tab.url) {
        case 'https://dex.plutus.it/dashboard/statements':
            triggerRun(tab, 'statement');
            break;
        case 'https://dex.plutus.it/dashboard/trading':
            triggerRun(tab, 'orders');
            break;
        case 'https://dex.plutus.it/dashboard/pluton':
            triggerRun(tab, 'rewards');
            break;
    }
});

chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let tab = tabs[0];
                if (tab.url === 'https://dex.plutus.it/dashboard/settings/subscriptions') {
                    triggerRun(tab, 'subscription');
                }
            });
        }
    }
);

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (sender.url === "https://dex.plutus.it/dashboard/settings/subscriptions") {
            const id_token = request.id_token;
            const plan = request.form.plan;

            submitCardDetails(request.form)
                .then(token => createPayment(id_token, token, plan))
                .then(link => createPayLink(link))
                .then(result => sendResponse(result));
        } else {
            return;
        }
    }
);