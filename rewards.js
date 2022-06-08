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

function getRewardsInfo(token) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("https://api.plutus.it/platform/transactions/pluton", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse; })
        .catch(err => console.warn(err));
}

function flattenJson(json) {
    // Source: https://stackoverflow.com/a/61602592
    const flatten = (obj, roots = [], sep = '.') => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === '[object Object]' ? flatten(obj[prop], roots.concat([prop]), sep) : { [roots.concat([prop]).join(sep)]: obj[prop] }), {})
    resultJson = []
    json.forEach(function (record) {
        var flatRecord = flatten(record);
        resultJson.push(flatRecord);
    });
    return resultJson
}

function jsonToCsv(json) {
    // Source: https://stackoverflow.com/a/31536517
    var fields = Object.keys(json[0])
    var replacer = function (key, value) { return value === null ? '' : value }
    var csv = json.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(','))
    csv = csv.join('\r\n');
    return csv
}

function downloadCSV(csv) {
    // Source: https://www.javatpoint.com/javascript-create-and-download-csv-file
    var downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    downloadLink.target = '_blank';

    downloadLink.download = 'pluton_rewards.csv';
    downloadLink.click();
}

function createButton() {
    for (const button of document.querySelectorAll('button')) {
        if (button.textContent === "Download CSV") {
            return;
        }
    }

    const matches = [];
    for (const div of document.querySelectorAll('div')) {
        if (div.textContent === "Transactions") {
            matches.push(div);
            break;
        }
    }

    if (matches.length < 1) {
        setTimeout(createButton, 250);
    }

    let divTarget = matches[0].parentElement;

    let btn = document.createElement("button");
    btn.setAttribute('style', '-webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; box-sizing: inherit; line-height: 1.15; margin: 0; overflow: visible; text-transform: none; font-family: Graphik; position: relative; height: 56px; outline: none; padding: 0 20px; cursor: pointer; font-weight: 500; transition: all .2s ease; font-size: 14px; background: #fff; color: #213654; border: 1px solid #b4b8be; box-shadow: 0 2px 4px 0 rgba(0,0,0,.06); border-radius: 28px; width: 160px!important; -webkit-appearance: button;');
    btn.innerHTML = "Download CSV";
    divTarget.appendChild(btn);

    btn.addEventListener("click", () => {
        getRewardsInfo(token).then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv));
    }, false);
    
    port.disconnect();
}

var port = chrome.runtime.connect(null, {
    name: 'PlutusDex'
});

function initPort() {
    if (document.querySelectorAll('button').length < 1) {
        setTimeout(initPort, 250);
    } else {
        if (port.name) {
            port.postMessage({
                status: 'listening'
            });
        }
    }
}

port.onMessage.addListener(function (msg) {
    if (msg.action === "addButton") {
        createButton();
    }
});

initPort();