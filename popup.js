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

let lastAction, lastCaller;

function sendMessage(caller, action) {
    // prevent multiple executions
    caller.disabled = true;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: action }, function (response) {
            if (!chrome.runtime.lastError && typeof response !== 'undefined') {
                if (response.action === action && response.status === "done") {
                    // restore button after 2 seconds
                    setTimeout(function () {
                        caller.disabled = false;
                    }, 2000);
                }
            } else {
                // in case the runtime listener is not available store caller & action before reloading the tab
                lastAction = action;
                lastCaller = caller;
                chrome.tabs.reload(tabId);
            }
        });
    });
}

author.addEventListener("click", async () => {
    chrome.tabs.create({ url: "https://twitter.com/_superhero1" });
});

donate.addEventListener("click", async () => {
    chrome.tabs.create({ url: "https://donate.plutus.link" });
});

statement.addEventListener("click", async (event) => {
    sendMessage(event.target, "statement");
});
orders.addEventListener("click", async (event) => {
    sendMessage(event.target, "orders");
});
rewards.addEventListener("click", async (event) => {
    sendMessage(event.target, "rewards");
});
withdrawals.addEventListener("click", async (event) => {
    sendMessage(event.target, "withdrawals");
});
transactions.addEventListener("click", async (event) => {
    sendMessage(event.target, "transactions");
});
<<<<<<< Updated upstream
=======
perks.addEventListener("click", async (event) => {
    sendMessage(event.target, "perks");
});
blockpit.addEventListener("click", async (event) => {
    sendMessage(event.target, "blockpit");
});
>>>>>>> Stashed changes

// resume last action if reloaded
chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
            if (lastCaller != null && lastAction != null) {
                sendMessage(lastCaller, lastAction);
            }
        }
    }
);

document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tabUrl = tabs[0].url;
        if (!tabUrl.startsWith("https://dex.plutus.it/dashboard")) {
            console.log("Clicked");
            container.innerHTML = `
            <div class="alert alert-danger d-flex align-items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:" viewBox="0 0 16 16" role="img">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>Please login to PlutusDex or change to the right tab.</div>
            </div>
            `
        }
    });
});