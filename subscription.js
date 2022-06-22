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

async function getSubscriptionInfo(id_token) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + id_token);

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

async function getPayments(id_token) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + id_token);
    myHeaders.append("Content-Type", "application/json");

    var json_data = JSON.stringify({
        'operationName': 'getPayments',
        'variables': {},
        'query': 'query getPayments {\n  checkout_subscription_payments(order_by: {created_at: desc},where: {status: {_eq: "Captured"}}) {\n    id\n    recurring\n    plan\n    status\n    created_at\n    updated_at\n    __typename\n    amount\n  }\n}'
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: json_data,
        redirect: 'follow'
    };

    return await fetch("https://hasura.plutus.it/v1alpha1/graphql", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.data.checkout_subscription_payments; })
        .catch(err => console.warn(err));
}

function addPaymentForm() {
    let introText = "We hope you enjoy the abundance of Rewards, Perks, and more!<br><br>Enter your payment details below. The subscription fee (as shown to the right) will be taken from here once every 30 days.";

    let outroText = "You hereby authorize Plutus to charge you automatically every month until you cancel your subscription. Full terms are available <a href=\"https://plutus.it/terms-and-conditions\">here</a>.";

    let title = "<span style=\"-webkit-text-size-adjust: 100%; font-family: Graphik; -webkit-font-smoothing: antialiased; box-sizing: inherit; font-size: 20px; font-weight: 500; color: #213654; font-stretch: normal; font-style: normal; line-height: 1; letter-spacing: normal; text-align: center; padding-bottom: 20px;\">Pay with Debit / Credit Card</span>";

    let payForm = document.createElement("form");
    payForm.setAttribute("onSubmit", "event.preventDefault();");
    payForm.setAttribute("id", "payForm");
    payForm.setAttribute("style", "margin-left: auto; margin-right: auto; text-align: left; display: inline-block;");

    var radioEveryday = document.createElement("input");
    radioEveryday.setAttribute("type", "radio");
    radioEveryday.setAttribute("name", "plan");
    radioEveryday.setAttribute("id", "everyday");
    radioEveryday.setAttribute("value", "everyday");
    radioEveryday.checked = true;
    radioEveryday.setAttribute("style", "margin-left: 20px; margin-right: 5px;")

    var labelEveryday = document.createElement("label");
    labelEveryday.setAttribute("for", "everyday");
    labelEveryday.innerHTML = "Everyday";
    labelEveryday.setAttribute("style", "margin-right: 10px;")

    var radioPremium = document.createElement("input");
    radioPremium.setAttribute("type", "radio");
    radioPremium.setAttribute("name", "plan");
    radioPremium.setAttribute("id", "premium");
    radioPremium.setAttribute("value", "premium");
    radioPremium.setAttribute("style", "margin-right: 5px;")

    var labelPremium = document.createElement("label");
    labelPremium.setAttribute("for", "premium");
    labelPremium.innerHTML = "Premium";
    labelPremium.setAttribute("style", "margin-right: 10px;")

    var CN = document.createElement("input");
    CN.setAttribute("type", "number");
    CN.setAttribute("name", "CardNumber");
    CN.setAttribute("placeholder", "Card Number");
    CN.setAttribute("maxlength", "16");
    CN.setAttribute("minlength", "16");
    CN.setAttribute("min", "1000000000000000");
    CN.setAttribute("max", "9999999999999999");
    CN.setAttribute("size", "16");
    CN.setAttribute("required", true);
    CN.setAttribute("style", "margin: 10px 0; margin-left: 25px;");

    var MM = document.createElement("input");
    MM.setAttribute("type", "number");
    MM.setAttribute("name", "MM");
    MM.setAttribute("placeholder", "MM");
    MM.setAttribute("maxlength", "2");
    MM.setAttribute("minlength", "2");
    MM.setAttribute("min", "1");
    MM.setAttribute("max", "12");
    MM.setAttribute("size", "2");
    MM.setAttribute("required", true);
    MM.setAttribute("style", "margin-left: 25px;");

    var YYYY = document.createElement("input");
    YYYY.setAttribute("type", "number");
    YYYY.setAttribute("name", "YYYY");
    YYYY.setAttribute("placeholder", "YYYY");
    YYYY.setAttribute("maxlength", "4");
    YYYY.setAttribute("minlength", "4");
    YYYY.setAttribute("min", "2022");
    YYYY.setAttribute("max", "2099");
    YYYY.setAttribute("size", "4");
    YYYY.setAttribute("required", true);
    YYYY.setAttribute("style", "margin-right: 10px;");

    var CVC = document.createElement("input");
    CVC.setAttribute("type", "password");
    CVC.setAttribute("name", "CVC");
    CVC.setAttribute("placeholder", "CVC");
    CVC.setAttribute("size", "3");
    CVC.setAttribute("required", true);
    CVC.setAttribute("style", "margin-right: 10px;");

    var s = document.createElement("input");
    s.setAttribute("type", "submit");
    s.setAttribute("onclick", "this.disabled=true;this.value='Please wait...'; this.setAttribute(\'style\',\'-webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-box-direction: normal; box-sizing: inherit; line-height: 1.15; margin: 0; overflow: visible; text-transform: none; font-family: Graphik; position: relative; height: 56px; outline: none; padding: 0 20px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s ease; color: #fff; border: 0; border-radius: 28px; -webkit-appearance: button; width: 200px; background: #ececec; margin-top: 10px;\'); const payForm = document.getElementById('payForm'); const data = new FormData(payForm); const formData = Object.fromEntries(data.entries()); chrome.runtime.sendMessage('necjdfandaodcoeagkacmlapednbihgl', {form: formData, id_token: localStorage['id_token']}, function(response) { const divTarget = document.getElementById('divPayFormContent'); divTarget.innerHTML = response; });");
    s.setAttribute("value", "Create Payment Link");
    s.setAttribute("style", "-webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; box-sizing: inherit; line-height: 1.15; margin: 0; overflow: visible; text-transform: none; font-family: Graphik; position: relative; height: 56px; outline: none; width: 100%; padding: 0 20px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s ease; background: #2569db; color: #fff; border: 0; border-radius: 28px; -webkit-appearance: button; width: 200px; margin-top: 10px;");

    var br = document.createElement("br");
    payForm.appendChild(radioEveryday);
    payForm.appendChild(labelEveryday);
    payForm.appendChild(radioPremium);
    payForm.appendChild(labelPremium);
    payForm.appendChild(br.cloneNode());
    payForm.appendChild(CN);
    payForm.appendChild(br.cloneNode());
    payForm.appendChild(MM);
    payForm.appendChild(YYYY);
    payForm.appendChild(CVC);
    payForm.appendChild(br.cloneNode());
    payForm.appendChild(s);

    if (document.getElementById('divPayForm')) {
        return;
    }

    const matches = [];
    for (const div of document.querySelectorAll('div')) {
        if (div.innerHTML.startsWith("You are currently on our ")) {
            matches.push(div);
            break;
        }
    }

    if (matches.length > 0) {
        let divTarget = matches[0].parentElement;

        let divPayForm = document.createElement("div");
        divPayForm.setAttribute("id", "divPayForm");
        divPayForm.setAttribute("style", "-webkit-text-size-adjust: 100%; font-family: Graphik; -webkit-font-smoothing: antialiased; line-height: normal; font-size: 14px; color: #333; box-sizing: inherit; margin-top: 20px; margin-right: 20px;");

        var PayFormHTML = introText + "<br><br>" + title + "<br><br>" + outroText;

        divPayForm.innerHTML = PayFormHTML;
        divTarget.appendChild(divPayForm);

        let divPayFormContent = document.createElement("div");
        divPayFormContent.setAttribute("id", "divPayFormContent");
        divPayFormContent.setAttribute("style", "margin-top: 20px; margin-right: 20px;display: block;text-align: center;");
        divPayFormContent.appendChild(payForm);
        divPayForm.appendChild(divPayFormContent);
    }
}

function addEndDate(json) {
    if (json.plan === "starter") {
        return true;
    } else {
        if (document.getElementById('ends_on')) {
            return;
        }

        const matches = [];
        for (const div of document.querySelectorAll('div')) {
            if (div.innerHTML.startsWith("You are currently on our ") && div.textContent.endsWith("plan")) {
                matches.push(div);
                break;
            }
        }

        if (matches.length > 0) {
            let divTarget = matches[0].parentElement;

            let divEndsOn = document.createElement("div");
            divEndsOn.setAttribute("id", "ends_on");
            divEndsOn.setAttribute("style", "color:#333;");
            divEndsOn.innerHTML = "Your subscription ends on <br>" + json.ends_on.split('T')[0] + ".";
            divTarget.appendChild(divEndsOn);
        }

        return false;
    }
}

function addLastPayments(json) {
    if (document.getElementById('payments')) {
        return;
    }

    const matches = [];
    for (const div of document.querySelectorAll('div')) {
        if (div.innerHTML.startsWith("You are currently on our ")) {
            matches.push(div);
            break;
        }
    }

    if (matches.length > 0) {
        let divTarget = matches[0].parentElement;

        let divPayments = document.createElement("div");
        divPayments.setAttribute("style", "-webkit-text-size-adjust: 100%; font-family: Graphik; -webkit-font-smoothing: antialiased; line-height: normal; font-size: 14px; color: #333; box-sizing: inherit;")
        divPayments.setAttribute("id", "payments")

        var paymentsHTML = '<br><div style="-webkit-text-size-adjust: 100%; font-family: Graphik; -webkit-font-smoothing: antialiased; box-sizing: inherit; font-size: 20px; font-weight: 500; color: #213654; font-stretch: normal; font-style: normal; line-height: 1; letter-spacing: normal;">Your last payments:</div> <br><div><ul>';

        json.forEach((payment) => {
            paymentsHTML += "<li>";
            paymentsHTML += payment.updated_at.split('T')[0];
            paymentsHTML += ", ";
            paymentsHTML += payment.amount / 100 + ", ";
            paymentsHTML += payment.plan;
            paymentsHTML += "</li>";
        });
        paymentsHTML += "</ul></div>";

        divPayments.innerHTML = paymentsHTML;
        divTarget.appendChild(divPayments);
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
            getSubscriptionInfo(token)
                .then(response => addEndDate(response))
                .then(isStarter => {
                    if (isStarter) {
                        getPayments(token).then(payments => addLastPayments(payments)).then(addPaymentForm());
                    } else {
                        getPayments(token).then(payments => addLastPayments(payments));
                    }
                })
                .then(port.disconnect());
        });
    }
});

initPort();