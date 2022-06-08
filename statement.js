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

function getStatementsInfo(token) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = "{\"operationName\":\"transactions_view\",\"variables\":{\"offset\":0,\"limit\":1000,\"from\":null,\"to\":null},\"query\":\"query transactions_view($offset: Int, $limit: Int, $from: timestamptz, $to: timestamptz) {\\n  transactions_view_aggregate(\\n    where: {_and: [{date: {_gte: $from}}, {date: {_lte: $to}}]}\\n  ) {\\n    aggregate {\\n      totalCount: count\\n      __typename\\n    }\\n    __typename\\n  }\\n  transactions_view(\\n    order_by: {date: desc}\\n    limit: $limit\\n    offset: $offset\\n    where: {_and: [{date: {_gte: $from}}, {date: {_lte: $to}}]}\\n  ) {\\n    id\\n    model\\n    user_id\\n    currency\\n    amount\\n    date\\n    type\\n    is_debit\\n    description\\n    __typename\\n  }\\n}\\n\"}";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://hasura.plutus.it/v1alpha1/graphql", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.data.transactions_view; })
        .catch(err => console.warn(err));
}

function fixStatements(json) {
    json.forEach(function (record) {
        switch (record.type) {
            case "0":
                record.type = "PENDING";
                break;
            case "5":
                record.type = "DECLINED_POS_CHARGE";
                break;
            case "29":
                record.type = "CARD_DEPOSIT";
                break;
            case "31":
                record.type = "PURCHASE";
                break;
            case "45":
                record.type = "REFUND";
                break;
            default:
                break;
        }
    });
    return json
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

    downloadLink.download = 'account_statement.csv';
    downloadLink.click();
}

function createButton() {
    const buttons = [];
    for (const button of document.querySelectorAll('button')) {
        if (button.textContent == "Download") {
            buttons.push(button);
        } else if (button.textContent == "Download CSV") {
            return;
        } 
    }

    let btnDownload = buttons[0];

    var btn = document.createElement("button");
    btn.setAttribute('style','-webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; box-sizing: inherit; line-height: 1.15; margin: 0; overflow: visible; text-transform: none; font-family: Graphik; position: relative; height: 56px; outline: none; padding: 0 20px; cursor: pointer; font-weight: 500; transition: all .2s ease; font-size: 14px; background: #fff; color: #213654; border: 1px solid #b4b8be; box-shadow: 0 2px 4px 0 rgba(0,0,0,.06); border-radius: 28px; width: 160px!important; -webkit-appearance: button;');
    btn.innerHTML = "Download CSV";
    btnDownload.parentNode.replaceChild(btn, btnDownload);   

    btn.addEventListener("click", () => {
        getStatementsInfo(token).then(response => fixStatements(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv));
    }, false);
}

chrome.runtime.onMessage.addListener(
    function (request, sender) {
        if (sender.id === "bldndingjfineldnjlimjikckjcodgne" && request.action === "addButton")
            createButton();
    }
);