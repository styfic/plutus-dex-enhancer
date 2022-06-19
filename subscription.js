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

var token = localStorage['id_token'];

async function getSubscriptionInfo(token) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://api.plutus.it/platform/subscription", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse; })
        .catch(err => console.warn(err));
}

function addEndDate(json) {
    for (const div of document.querySelectorAll('div')) {
        if (div.textContent.includes("Your subscription ends on ")) {
            return;
        }
    }

    const matches = [];
    for (const div of document.querySelectorAll('div')) {
        if (div.textContent.startsWith("You are currently on our ") && div.textContent.endsWith("plan")) {
            matches.push(div);
            break;
        }
    }

    if (matches.length > 0) {
        let divTarget = matches[0];

        let divEndsOn = document.createElement("div");
        divEndsOn.innerHTML = "Your subscription ends on <br>" + json.ends_on.split('T')[0] + ".";
        divTarget.appendChild(divEndsOn);

        port.disconnect();
    }
}

// Source: https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

var port = chrome.runtime.connect(null, {
    name: 'PlutusDex - Subscription'
});

function initPort() {
    if (port.name) {
        port.postMessage({
            status: 'listening',
            action: 'subscription'
        });
    }
}

port.onMessage.addListener(function (msg) {
    if (msg.action === "subscription") {
        waitForElm('#react-app > div > div.geEcESExyiIzbObfkkL3Ng\\=\\= > div._5WI0ofGTlf55VoTUNGyFrA\\=\\= > div > div.JHUE0LWfV-l1JNL3ayLasQ\\=\\= > div > div > span').then((elm) => {
            getSubscriptionInfo(token).then(response => addEndDate(response));
        });
    }
});

initPort();