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

    var raw = "{\"operationName\":\"transactions_view\",\"variables\":{\"offset\":0,\"limit\":null,\"from\":null,\"to\":null},\"query\":\"query transactions_view($offset: Int, $limit: Int, $from: timestamptz, $to: timestamptz) {\\n  transactions_view_aggregate(\\n    where: {_and: [{date: {_gte: $from}}, {date: {_lte: $to}}]}\\n  ) {\\n    aggregate {\\n      totalCount: count\\n      __typename\\n    }\\n    __typename\\n  }\\n  transactions_view(\\n    order_by: {date: desc}\\n    limit: $limit\\n    offset: $offset\\n    where: {_and: [{date: {_gte: $from}}, {date: {_lte: $to}}]}\\n  ) {\\n    id\\n    model\\n    user_id\\n    currency\\n    amount\\n    date\\n    type\\n    is_debit\\n    description\\n    __typename\\n  }\\n}\\n\"}";

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

var port = chrome.runtime.connect(null, {
    name: 'PlutusDex - Statement'
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
    if (msg.action === "run") {
        getStatementsInfo(token).then(response => fixStatements(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv)).then(port.disconnect());
    }
});

initPort();